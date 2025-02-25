import ExcelJS from 'exceljs'
import type { ImagePosition } from 'exceljs'
import { saveAs } from 'file-saver'
import { createDefectsFindingSheet } from './exportDefectsFinding'
import { LOGO, ALERT_ICON } from './excelUtils'

export interface QCReportData {
  // 基本信息
  modelCode: string
  factoryCode: string
  supplier: string
  client: string
  poNumber: string
  inspectionDate: string
  orderQty: number
  reportDate: string
  inspectQty: number
  qcOfficer: string
  passFail: 'Pass' | 'Fail'
  secondQCDate: string
  comments: string

  // 产品外观图片
  stocksInWarehouse?: string
  samplingOfProductsQuantity?: string
  shippingMarks?: string
  barcode?: string
  packingOutside?: string
  packingInside?: string

  // 椅子组件图片
  chairComponentsPacked?: string
  chairComponentsUnpacked?: string

  // 配件包图片
  fittingPackPacked?: string
  fittingPackUnpacked?: string

  // 标签和说明图片
  productionLabel?: string
  assemblyInstructions?: string

  // 组件图片
  imageOfComponentsSeat?: string
  imageOfComponentsBack?: string
  imageOfComponentsBase?: string
  imageOfComponentsCastors?: string
  imageOfComponentsGasLiftCover?: string
  imageOfComponentsGasLiftStamp?: string
  imageOfComponentsArmrest?: string
  imageOfComponentMechanism?: string
  imageOfComponentsHeadrest?: string

  // 成品图片
  imageOfProductBuiltFront?: string
  imageOfProductBuiltSide?: string
  imageOfProductBuiltBack?: string
  imageOfProductBuilt45Degree?: string
  frontImageOfProductBuiltCompare1?: string
  frontImageOfProductBuiltCompare2?: string

  // 功能检查图片
  functionCheckSeatHeightExtension?: string
  functionCheckMechanismAdjustment?: string
  functionCheckArmrestAdjustment?: string
  functionCheckHeadrestAdjustment?: string
  functionCheckOther1?: string
  functionCheckOther2?: string

  // 缺陷记录
  defects?: {
    defectTitle: string
    defectDescription: string
    improvementSuggestion: string
    inspector: string
    images: string[]
  }[]

  // 其他必需字段
  inspector: string
  inspectionLocation: string
  sampleSize: number
  defectCount: number
}

// 将 base64 字符串转换为 Uint8Array
const base64ToUint8Array = (base64: string): Uint8Array => {
  const base64String = base64.split(',')[1]
  const binaryString = window.atob(base64String)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

/**
 * 获取图片的二进制数据
 * @param url - 图片URL
 * @returns Promise<Uint8Array | null> - 返回图片的二进制数据
 */
export const getImageBuffer = async (url: string): Promise<Uint8Array | null> => {
  try {
    // 将外部URL转换为使用代理的URL
    const proxyUrl = url.startsWith('https://img.shetu66.com')
      ? url.replace('https://img.shetu66.com', '/img-proxy')
      : url

    const response = await fetch(proxyUrl)
    if (!response.ok) {
      console.warn(`获取图片失败: ${url}, 状态码: ${response.status}`)
      return null
    }

    const arrayBuffer = await response.arrayBuffer()
    return new Uint8Array(arrayBuffer)
  } catch (error) {
    console.warn(`获取图片出错: ${url}`, error)
    return null
  }
}

const streamToBlob = async (stream: NodeJS.ReadableStream): Promise<Blob> => {
  const chunks: Uint8Array[] = []
  
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => {
      const blob = new Blob(chunks, {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      resolve(blob)
    })
  })
}

// 获取图片尺寸
export const getImageDimensions = (imageBuffer: Uint8Array): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' })
    const img = new Image()
    const url = URL.createObjectURL(blob)
    
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: img.width,
        height: img.height
      })
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    
    img.src = url
  })
}

// 添加单个缺陷问题的函数
const addDefectSection = async (
  worksheet: ExcelJS.Worksheet,
  defect: NonNullable<QCReportData['defects']>[number],
  alertImageId: number,
  workbook: ExcelJS.Workbook
) => {
  // 添加标题行
  const titleRow = worksheet.addRow(['', '', '', `Title (${defect.defectTitle}):`, '', '', '', ''])
  titleRow.height = 35
  const titleCell = titleRow.getCell(4)  // D列
  titleCell.font = { name: 'Arial', size: 18, bold: true }
  worksheet.mergeCells(`D${titleRow.number}:G${titleRow.number}`)

  // 计算警告图标的尺寸
  const INCH_TO_PIXEL = 96  // 1英寸 = 96像素
  const iconSize = 0.63 * INCH_TO_PIXEL  // 0.63英寸转换为像素

  // 设置图片区域的边框和背景样式
  const redBorderStyle = { style: 'medium' as const, color: { argb: 'FFFF0000' } }
  const blueBorderStyle = { style: 'medium' as const, color: { argb: 'FF0000FF' } }
  const whiteFill = {
    type: 'pattern' as const,
    pattern: 'solid' as const,
    fgColor: { argb: 'FFFFFFFF' }
  }

  // 添加警告图标到C列
  worksheet.addImage(alertImageId, {
    tl: { 
      col: 2,  // C列
      row: titleRow.number - 1  // 对齐行顶部
    },
    ext: { 
      width: iconSize,
      height: iconSize  // 保持正方形
    }
  })

  // 设置C列单元格居中对齐
  const iconCell = titleRow.getCell(3)  // C列
  iconCell.alignment = {
    vertical: 'middle',
    horizontal: 'center'
  }

  // 创建图片区域行（只包含空白内容）
  const imageAreaRow = worksheet.addRow(['', '', 'Image1', '', '', 'Image2', '', ''])
  imageAreaRow.height = 150

  // 设置第一个图片区域（横跨C和D列）
  const imageCell1Label = imageAreaRow.getCell(3)
  const imageCell1Content = imageAreaRow.getCell(4)
  worksheet.mergeCells(`C${imageAreaRow.number}:D${imageAreaRow.number}`)
  
  // 设置边框（只在合并后的单元格外围）
  imageCell1Label.border = {
    top: redBorderStyle,
    left: redBorderStyle,
    bottom: redBorderStyle,
    right: redBorderStyle
  }
  
  // 设置背景和标签
  imageCell1Label.fill = whiteFill
  imageCell1Label.value = 'Image1'
  imageCell1Label.font = {
    name: 'Arial',
    size: 10,
    color: { argb: 'FF666666' }
  }
  imageCell1Label.alignment = {
    vertical: 'top',
    horizontal: 'left',
    indent: 1,
    wrapText: false
  }

  // 设置第二个图片区域（横跨F和G列）
  const imageCell2Label = imageAreaRow.getCell(6)
  const imageCell2Content = imageAreaRow.getCell(7)
  worksheet.mergeCells(`F${imageAreaRow.number}:G${imageAreaRow.number}`)
  
  // 设置边框（只在合并后的单元格外围）
  imageCell2Label.border = {
    top: redBorderStyle,
    left: redBorderStyle,
    bottom: redBorderStyle,
    right: redBorderStyle
  }
  
  // 设置背景和标签
  imageCell2Label.fill = whiteFill
  imageCell2Label.value = 'Image2'
  imageCell2Label.font = {
    name: 'Arial',
    size: 10,
    color: { argb: 'FF666666' }
  }
  imageCell2Label.alignment = {
    vertical: 'top',
    horizontal: 'left',
    indent: 1,
    wrapText: false
  }

  // 添加空行并合并C到G列
  const emptyRow = worksheet.addRow([''])
  worksheet.mergeCells(`C${emptyRow.number}:G${emptyRow.number}`)

  // 添加描述行
  const descriptionRow = worksheet.addRow(['', '', defect.defectDescription, '', '', '', '', ''])
  descriptionRow.height = 100
  worksheet.mergeCells(`C${descriptionRow.number}:G${descriptionRow.number}`)

  // 设置描述单元格的样式
  const descriptionCell = descriptionRow.getCell(3)  // C列
  descriptionCell.fill = whiteFill
  descriptionCell.alignment = {
    vertical: 'top',
    horizontal: 'left',
    wrapText: true,
    indent: 1
  }

  // 设置描述单元格的边框
  descriptionCell.border = {
    top: blueBorderStyle,
    left: blueBorderStyle,
    bottom: blueBorderStyle,
    right: blueBorderStyle
  }

  // 添加空行
  worksheet.addRow([''])

  // 添加图片
  if (defect.images && defect.images.length > 0) {
    for (let i = 0; i < Math.min(2, defect.images.length); i++) {
      const imageUrl = 'https://img.shetu66.com/2023/04/25/1682391094827084.png'
      const imageBuffer = await getImageBuffer(imageUrl)
      
      if (imageBuffer) {
        try {
          const imageId = workbook.addImage({
            buffer: imageBuffer,
            extension: 'jpeg'
          })

          // 获取图片尺寸
          const dimensions = await getImageDimensions(imageBuffer)
          
          // 计算可用空间
          const cellWidth = (4 - 3 + 1) * 64  // 每列64像素
          const cellHeight = 5 * 20  // 5行高度,每行20像素

          // 计算最佳缩放比例
          const maxScale = 0.98  // 最大缩放比例
          const minScale = 0.85  // 最小缩放比例
          const scaleWidth = (cellWidth * maxScale) / dimensions.width
          const scaleHeight = (cellHeight * maxScale) / dimensions.height
          let scale = Math.min(scaleWidth, scaleHeight)

          // 如果缩放后的尺寸仍然太大，进一步缩小
          if (scale > minScale) {
            scale = minScale
          }

          // 计算最终尺寸
          const finalWidth = dimensions.width * scale
          const finalHeight = dimensions.height * scale

          // 计算图片框的总宽度（以像素为单位）
          const frameWidthColumns = 4 - 3 + 1  // 总列数
          const frameWidthPixels = frameWidthColumns * 64

          // 计算水平居中的偏移量
          const horizontalOffset = (frameWidthPixels - finalWidth) / (2 * 64)

          // 计算垂直居中的偏移量（转换为Excel行单位）
          const frameHeightPixels = 3.04 * 96
          const verticalOffsetPixels = (frameHeightPixels - finalHeight) / 2
          const verticalOffset = verticalOffsetPixels / 20

          worksheet.addImage(imageId, {
            tl: { col: 3 + horizontalOffset, row: imageAreaRow.number - 0.95 },
            ext: { width: finalWidth, height: finalHeight }
          })
        } catch (error) {
          console.warn(`添加图片失败: ${imageUrl}`, error)
        }
      }
    }
  }
}

export const exportQCReport = async (data: QCReportData) => {
  try {
    console.log('开始创建工作簿...')
    const workbook = new ExcelJS.Workbook()
    
    // 设置文档属性
    workbook.creator = 'QC Report System'
    workbook.lastModifiedBy = 'QC Report System'
    workbook.created = new Date()
    workbook.modified = new Date()
    
    console.log('创建工作表...')
    const summaryWorksheet = workbook.addWorksheet('Summary report', {
      pageSetup: {
        paperSize: 9,  // A4纸
        orientation: 'portrait',
        fitToPage: false,  // 改为false，不自动适应页面
        printArea: 'C1:Q268',  // 设置整体打印区域
        scale: 100,  // 保持100%缩放
        horizontalCentered: true,
        verticalCentered: true,
        margins: {
          left: 0.25,
          right: 0.25,
          top: 0.25,
          bottom: 0.25,
          header: 0,
          footer: 0
        },
        showGridLines: false,
        blackAndWhite: false  // 设置为false以启用彩色打印
      },
      properties: {
        defaultRowHeight: 15,
        defaultColWidth: 8.43,
        outlineLevelRow: 0,
        outlineLevelCol: 0,
        showGridLines: false
      }
    })

    // 设置列宽
    summaryWorksheet.getColumn('C').width = 3  // C列宽度为3
    // 设置D到P列的宽度为6
    for (let col = 4; col <= 16; col++) {  // 4代表D列，16代表P列
      summaryWorksheet.getColumn(col).width = 6
    }
    summaryWorksheet.getColumn('Q').width = 3  // Q列宽度为3

    // 设置分页符
    const pageBreakRows = [40, 78, 116, 154, 192, 230]
    pageBreakRows.forEach(rowNumber => {
      summaryWorksheet.getRow(rowNumber).addPageBreak()
    })

    // 设置每页的行高
    const pageRanges = [
      { start: 1, end: 40 },     // 第一页保持不变
      { start: 42, end: 78 },    // 第二页
      { start: 80, end: 116 },   // 第三页
      { start: 118, end: 154 },  // 第四页
      { start: 156, end: 192 },  // 第五页
      { start: 194, end: 230 },  // 第六页
      { start: 232, end: 268 }   // 第七页
    ]

    // 设置每页的行高
    pageRanges.forEach(({ start, end }) => {
      // 第一行设置为空行
      const firstRow = summaryWorksheet.getRow(start)
      firstRow.height = 15

      // 最后一行设置为页码行
      const lastRow = summaryWorksheet.getRow(end)
      lastRow.height = 15

      // 中间行的高度
      for (let row = start + 1; row < end; row++) {
        const currentRow = summaryWorksheet.getRow(row)
        currentRow.height = 15
      }
    })

    // 设置打印标题
    summaryWorksheet.pageSetup.printTitlesRow = '1:1'

    // 定义边框样式
    const blueBorderStyle = { style: 'medium' as const, color: { argb: 'FF0000FF' } }
    const redBorderStyle = { style: 'medium' as const, color: { argb: 'FFFF0000' } }
    const blackBorderStyle = { style: 'medium' as const, color: { argb: 'FF000000' } }

    // 设置整页的深蓝色外边框
    const startRow = 2
    const endRow = 40  // 从55改为40
    const startCol = 3  // C列
    const endCol = 17   // Q列

    // 设置上边框
    for (let col = startCol; col <= endCol; col++) {
      const cell = summaryWorksheet.getCell(startRow, col)
      cell.border = {
        ...cell.border,
        top: blueBorderStyle
      }
    }

    // 设置下边框
    for (let col = startCol; col <= endCol; col++) {
      const cell = summaryWorksheet.getCell(endRow, col)
      cell.border = {
        ...cell.border,
        bottom: blueBorderStyle
      }
    }

    // 设置左右边框
    for (let row = startRow; row <= endRow; row++) {
      // 左边框 (C列)
      const leftCell = summaryWorksheet.getCell(row, startCol)
      leftCell.border = {
        ...leftCell.border,
        left: blueBorderStyle
      }
      
      // 右边框 (Q列)
      const rightCell = summaryWorksheet.getCell(row, endCol)
      rightCell.border = {
        ...rightCell.border,
        right: blueBorderStyle
      }
    }

    // 添加 Logo 和标题区域
    const logoRow = summaryWorksheet.addRow([''])
    logoRow.height = 20

    // 添加 Logo 图片
    const logoImageBuffer = base64ToUint8Array(LOGO)
    const logoImageId = workbook.addImage({
      buffer: logoImageBuffer,
      extension: 'jpeg',
    })

    // 在右上角添加 Logo
    summaryWorksheet.addImage(logoImageId, {
      tl: { col: 13, row: 3 },     // N列从14改为13
      ext: { width: 130, height: 45 }  // 调整高度从65改为45以适应两行高度
    })

    // 添加标题和副标题
    const titleRange = 'I6:P8'  // 从K6:P8改为I6:P8
    const subtitleRange = 'J9:P9'

    // 添加标题
    summaryWorksheet.mergeCells(titleRange)
    const titleCell = summaryWorksheet.getCell('I6')  // 从K6改为I6
    titleCell.value = {
      richText: [
        { text: 'TC : ', font: { name: 'Arial', size: 28, bold: true, color: { argb: 'FF000000' } } },
        { text: 'QC Report', font: { name: 'Arial', size: 28, bold: true, color: { argb: 'FF808080' } } }
      ]
    }
    titleCell.alignment = { vertical: 'bottom', horizontal: 'right' }
    titleCell.border = {
      top: undefined,
      left: undefined,
      bottom: undefined,
      right: undefined
    }

    // 添加副标题
    summaryWorksheet.mergeCells(subtitleRange)
    const subtitleCell = summaryWorksheet.getCell('J9')  // 从J10改为J9
    subtitleCell.value = {
      richText: [
        { text: 'Quality Control / Product Development Department', font: { name: 'Arial', size: 11, italic: true, color: { argb: 'FF808080' } } }
      ]
    }
    subtitleCell.alignment = { vertical: 'middle', horizontal: 'right' }
    subtitleCell.border = {
      top: undefined,
      left: undefined,
      bottom: undefined,
      right: undefined
    }

    // 添加空行
    summaryWorksheet.addRow([''])
    summaryWorksheet.addRow([''])  // 再添加一个空行

    // 设置重要信息提示文本
    summaryWorksheet.mergeCells('F12:K13')  // 从F12:K12改为F12:K13
    const infoTitleCell = summaryWorksheet.getCell('F12')
    infoTitleCell.value = 'Important Information, Please complete carefully:'
    infoTitleCell.font = { name: 'Arial', size: 11, bold: true }
    infoTitleCell.alignment = { 
      vertical: 'middle', 
      horizontal: 'center'  // 从'left'改为'center'
    }
    
    // 添加R12和R13的左边框
    const r12Cell = summaryWorksheet.getCell('R12')
    const r13Cell = summaryWorksheet.getCell('R13')
    r12Cell.border = {
      ...r12Cell.border,
      left: blueBorderStyle
    }
    r13Cell.border = {
      ...r13Cell.border,
      left: blueBorderStyle
    }

    // 添加D11:P25的黑色外边框
    // 设置上边框
    for (let col = 4; col <= 16; col++) {
      const cell = summaryWorksheet.getCell(11, col)  // 从12改为11
      cell.border = {
        ...cell.border,
        top: blackBorderStyle
      }
    }

    // 设置下边框
    for (let col = 4; col <= 16; col++) {
      const cell = summaryWorksheet.getCell(25, col)  // 从26改为25
      cell.border = {
        ...cell.border,
        bottom: blackBorderStyle
      }
    }

    // 设置左右边框
    for (let row = 11; row <= 25; row++) {  // 从12-26改为11-25
      // 左边框 (D列)
      const leftCell = summaryWorksheet.getCell(row, 4)
      leftCell.border = {
        ...leftCell.border,
        left: blackBorderStyle
      }
      
      // 右边框 (P列)
      const rightCell = summaryWorksheet.getCell(row, 16)
      rightCell.border = {
        ...rightCell.border,
        right: blackBorderStyle
      }
    }

    // 添加警告图标
    const alertImageBuffer = base64ToUint8Array(ALERT_ICON)
    const alertImageId = workbook.addImage({
      buffer: alertImageBuffer,
      extension: 'png',
    })

    // 添加警告图标位置调整
    const rowHeight = 25 * 2  // 两行的高度
    summaryWorksheet.addImage(alertImageId, {
      tl: { col: 4.7, row: 11 },  // 从row: 9改为row: 11 (对应第12行)
      ext: { width: rowHeight, height: rowHeight }
    })

    // 添加信息框
    const infoStartRow = 15
    const infoBoxEndRow = infoStartRow + 8

    // 添加信息框数据
    const infoData = [
      [{ label: 'Model code:', value: data.modelCode }, { label: 'Factory code:', value: data.factoryCode }],
      [{ label: 'Supplier:', value: data.supplier }, { label: 'Client:', value: data.client }],
      [{ label: 'PO Number:', value: data.poNumber }, { label: 'Inspection date:', value: data.inspectionDate }],
      [{ label: 'Order Qty:', value: data.orderQty.toString() }, { label: 'Report date:', value: data.reportDate }],
      [{ label: 'Inspect Qty:', value: data.inspectQty.toString() }, { label: 'QC Officer:', value: data.qcOfficer }]
    ]

    // 添加信息框数据
    infoData.forEach((rowData, rowIndex) => {
      // 计算实际的行号(考虑空行)
      const currentRow = infoStartRow + (rowIndex * 2)  // 每行数据之间加一个空行
      const row = summaryWorksheet.getRow(currentRow)
      row.height = 20

      // 添加一个空行
      if (rowIndex < infoData.length - 1) {  // 最后一行数据后不需要空行
        const emptyRow = summaryWorksheet.getRow(currentRow + 1)
        emptyRow.height = 8
      }

      // 处理每一对键值
      rowData.forEach((item, index) => {
        // 第一组: E,F合并作为label, G,H,I合并作为value
        if (index === 0) {
          // 合并label单元格
          summaryWorksheet.mergeCells(currentRow, 5, currentRow, 6)  // E,F合并
          const labelCell = row.getCell(5)  // E列
          labelCell.value = item.label
          labelCell.font = { name: 'Arial', size: 11, bold: true }
          labelCell.alignment = { vertical: 'middle', horizontal: 'left' }

          // 合并value单元格
          summaryWorksheet.mergeCells(currentRow, 7, currentRow, 9)  // G,H,I合并
          const valueCell = row.getCell(7)  // G列
          valueCell.value = item.value
          valueCell.font = { name: 'Arial', size: 11 }
          valueCell.alignment = { vertical: 'middle', horizontal: 'left' }
          valueCell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        }
        // 第二组: K,L合并作为label, M,N,O合并作为value
        else {
          // 合并label单元格
          summaryWorksheet.mergeCells(currentRow, 11, currentRow, 12)  // K,L合并
          const labelCell = row.getCell(11)  // K列
          labelCell.value = item.label
          labelCell.font = { name: 'Arial', size: 11, bold: true }
          labelCell.alignment = { vertical: 'middle', horizontal: 'left' }

          // 合并value单元格
          summaryWorksheet.mergeCells(currentRow, 13, currentRow, 15)  // M,N,O合并
          const valueCell = row.getCell(13)  // M列
          valueCell.value = item.value
          valueCell.font = { name: 'Arial', size: 11 }
          valueCell.alignment = { vertical: 'middle', horizontal: 'left' }
          valueCell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        }
      })
    })

    // Pass/Fail 行调整到28行
    const passFailRow = summaryWorksheet.getRow(28)
    passFailRow.height = 20

    // 添加 Pass/Fail 标签
    const passFailLabelCell = summaryWorksheet.getCell('E28')
    passFailLabelCell.value = 'Pass / Fail:'
    passFailLabelCell.font = { name: 'Arial', size: 11, bold: true }
    passFailLabelCell.alignment = { vertical: 'middle', horizontal: 'left' }

    // 添加 Pass/Fail 值（带边框的框）
    summaryWorksheet.mergeCells('G28:I28')
    const passFailValueCell = summaryWorksheet.getCell('G28')
    passFailValueCell.value = data.passFail || 'N/A'
    passFailValueCell.font = { name: 'Arial', size: 11 }
    passFailValueCell.alignment = { vertical: 'middle', horizontal: 'left' }
    passFailValueCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }

    // 添加 2nd QC Date 标签
    const secondQCDateLabelCell = summaryWorksheet.getCell('K28')
    secondQCDateLabelCell.value = '2nd QC Date:'
    secondQCDateLabelCell.font = { name: 'Arial', size: 11, bold: true }
    secondQCDateLabelCell.alignment = { vertical: 'middle', horizontal: 'left' }

    // 添加 2nd QC Date 值（带边框的框）
    summaryWorksheet.mergeCells('M28:O28')
    const secondQCDateValueCell = summaryWorksheet.getCell('M28')
    secondQCDateValueCell.value = data.secondQCDate || ''
    secondQCDateValueCell.font = { name: 'Arial', size: 11 }
    secondQCDateValueCell.alignment = { vertical: 'middle', horizontal: 'left' }
    secondQCDateValueCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }

    // 设置Pass/Fail区域的红色边框
    // 设置上边框
    for (let col = 4; col <= 16; col++) {
      const cell = summaryWorksheet.getCell(27, col)  // 从28改为27
      cell.border = {
        ...cell.border,
        top: redBorderStyle
      }
    }

    // 设置下边框
    for (let col = 4; col <= 16; col++) {
      const cell = summaryWorksheet.getCell(29, col)  // 从30改为29
      cell.border = {
        ...cell.border,
        bottom: redBorderStyle
      }
    }

    // 设置左右边框
    for (let row = 27; row <= 29; row++) {  // 从28-30改为27-29
      // 左边框 (D列)
      const leftCell = summaryWorksheet.getCell(row, 4)
      leftCell.border = {
        ...leftCell.border,
        left: redBorderStyle
      }
      
      // 右边框 (P列)
      const rightCell = summaryWorksheet.getCell(row, 16)
      rightCell.border = {
        ...rightCell.border,
        right: redBorderStyle
      }
    }

    // 添加评论标题
    summaryWorksheet.addRow([''])
    
    // 主标题 D31:K33
    summaryWorksheet.mergeCells('D31:K33')
    const commentTitleCell = summaryWorksheet.getCell('D31')
    commentTitleCell.value = {
      richText: [
        { text: 'TC : ', font: { name: 'Arial', size: 28, bold: true, color: { argb: 'FF000000' } } },
        { text: 'Comments / Evaluation', font: { name: 'Arial', size: 28, bold: true, color: { argb: 'FF808080' } } }
      ]
    }

    // 副标题 D34:K34
    summaryWorksheet.mergeCells('D34:K34')
    const commentSubtitleCell = summaryWorksheet.getCell('D34')
    commentSubtitleCell.value = {
      richText: [
        { text: 'Quality Control / Product Development Department', font: { name: 'Arial', size: 11, italic: true, color: { argb: 'FF808080' } } }
      ]
    }
    commentSubtitleCell.alignment = { 
      vertical: 'middle', 
      horizontal: 'right'
    }

    // 添加评论内容
    const commentRow = summaryWorksheet.getRow(36)
    commentRow.height = 15

    // 合并D36:P39单元格用于评价内容
    summaryWorksheet.mergeCells('D36:P39')
    const commentCell = summaryWorksheet.getCell('D36')
    commentCell.value = data.comments || ''
    commentCell.alignment = { 
      vertical: 'top', 
      horizontal: 'left', 
      wrapText: true 
    }
    commentCell.border = {
      top: redBorderStyle,
      left: redBorderStyle,
      bottom: redBorderStyle,
      right: redBorderStyle
    }

    // 设置每页的页码
    const pageNumbers = [
      { cell: 'D40', page: 1 },
      { cell: 'D78', page: 2 },
      { cell: 'D116', page: 3 },
      { cell: 'D154', page: 4 },
      { cell: 'D192', page: 5 },
      { cell: 'D230', page: 6 },
      { cell: 'D268', page: 7 }
    ]

    // 统一设置所有页码
    pageNumbers.forEach(({ cell, page }) => {
      const pageCell = summaryWorksheet.getCell(cell)
      pageCell.value = `Page ${page}`
      pageCell.font = { name: 'Arial', size: 10 }
      pageCell.alignment = { vertical: 'middle', horizontal: 'left' }
    })

    // 在52行插入空行
    const emptyRow = summaryWorksheet.getRow(52)
    emptyRow.height = 15  // 从30改为15，与其他行保持一致

    // 设置第二页的深蓝色外边框
    const secondPageStartRow = 42  // 从42改为42
    const secondPageEndRow = 78   // 从80改为78

    // 设置上边框
    for (let col = startCol; col <= endCol; col++) {
      const cell = summaryWorksheet.getCell(secondPageStartRow, col)
      cell.border = {
        ...cell.border,
        top: blueBorderStyle
      }
    }

    // 设置下边框
    for (let col = startCol; col <= endCol; col++) {
      const cell = summaryWorksheet.getCell(secondPageEndRow, col)
      cell.border = {
        ...cell.border,
        bottom: blueBorderStyle
      }
    }

    // 设置左右边框
    for (let row = secondPageStartRow; row <= secondPageEndRow; row++) {
      // 左边框 (C列)
      const leftCell = summaryWorksheet.getCell(row, startCol)
      leftCell.border = {
        ...leftCell.border,
        left: blueBorderStyle
      }
      
      // 右边框 (Q列)
      const rightCell = summaryWorksheet.getCell(row, endCol)
      rightCell.border = {
        ...rightCell.border,
        right: blueBorderStyle
      }
    }

    // 修改图片区域的配置
    interface ImageArea {
      title: string
      imageKey: keyof Pick<QCReportData, 
        'stocksInWarehouse' | 'samplingOfProductsQuantity' | 
        'shippingMarks' | 'barcode' | 
        'packingOutside' | 'packingInside'
      >
      row: number
    }

    // 修改图片区域的起始行号和范围
    const imageAreas: ImageArea[] = [
      { title: 'Stocks in warehouse', imageKey: 'stocksInWarehouse', row: 42 },
      { title: 'Sampling of products---quantity', imageKey: 'samplingOfProductsQuantity', row: 42 },
      { title: 'Shipping marks', imageKey: 'shippingMarks', row: 54 },
      { title: 'Barcode', imageKey: 'barcode', row: 54 },
      { title: 'Packing---outside', imageKey: 'packingOutside', row: 66 },
      { title: 'Packing---inside', imageKey: 'packingInside', row: 66 }
    ]

    // 添加图片区域
    for (let i = 0; i < imageAreas.length; i++) {
      const area = imageAreas[i]
      const isLeftSide = i % 2 === 0
      const colStart = isLeftSide ? 4 : 11  // 左侧从D列开始，右侧从K列开始
      const colEnd = isLeftSide ? 9 : 16    // 左侧到I列结束，右侧到P列结束

      // 添加标题
      const titleRow = summaryWorksheet.getRow(area.row)
      titleRow.height = 10
      const titleCell = titleRow.getCell(colStart)
      titleCell.value = area.title
      titleCell.font = { name: 'Arial', size: 11, bold: true }
      titleCell.alignment = { vertical: 'bottom', horizontal: 'left' }

      // 添加图片框
      const imageRow = area.row + 1
      const imageRowEnd = area.row + 11  // 从6行增加到11行
      for (let col = colStart; col <= colEnd; col++) {
        // 设置上边框
        const topCell = summaryWorksheet.getCell(imageRow, col)
        topCell.border = { ...topCell.border, top: blackBorderStyle }
        
        // 设置下边框
        const bottomCell = summaryWorksheet.getCell(imageRowEnd, col)
        bottomCell.border = { ...bottomCell.border, bottom: blackBorderStyle }
      }

      // 设置左右边框
      for (let row = imageRow; row <= imageRowEnd; row++) {
        // 左边框
        const leftCell = summaryWorksheet.getCell(row, colStart)
        leftCell.border = { ...leftCell.border, left: blackBorderStyle }
        
        // 右边框
        const rightCell = summaryWorksheet.getCell(row, colEnd)
        rightCell.border = { ...rightCell.border, right: blackBorderStyle }
      }

      // 如果有图片数据，添加图片
      if (data[area.imageKey]) {
        const imageUrl = data[area.imageKey]
        if (typeof imageUrl === 'string') {
          const processedImage = await processImage(imageUrl, workbook, colStart, colEnd, imageRow)
          if (processedImage) {
            summaryWorksheet.addImage(processedImage.imageId, processedImage.position)
          }
        }
      }
    }

    // 添加空行分隔第二页和第三页
    const emptyRow2 = summaryWorksheet.addRow([''])
    emptyRow2.height = 15

    // 设置第三页的深蓝色外边框
    const thirdPageStartRow = 80  // 从82改为80
    const thirdPageEndRow = 116   // 从120改为116
    
    // 设置第三页边框
    for (let col = startCol; col <= endCol; col++) {
      const cell = summaryWorksheet.getCell(thirdPageStartRow, col)
      cell.border = { ...cell.border, top: blueBorderStyle }
    }
    for (let col = startCol; col <= endCol; col++) {
      const cell = summaryWorksheet.getCell(thirdPageEndRow, col)
      cell.border = { ...cell.border, bottom: blueBorderStyle }
    }
    for (let row = thirdPageStartRow; row <= thirdPageEndRow; row++) {
      const leftCell = summaryWorksheet.getCell(row, startCol)
      const rightCell = summaryWorksheet.getCell(row, endCol)
      leftCell.border = { ...leftCell.border, left: blueBorderStyle }
      rightCell.border = { ...rightCell.border, right: blueBorderStyle }
    }

    // 修改第三页图片区域配置
    interface ThirdPageImageArea {
      title: string
      imageKey: keyof Pick<QCReportData,
        'chairComponentsPacked' | 'chairComponentsUnpacked' |
        'fittingPackPacked' | 'fittingPackUnpacked' |
        'productionLabel' | 'assemblyInstructions'
      >
      row: number
    }

    const thirdPageImageAreas: ThirdPageImageArea[] = [
      { title: 'Chair components---packed', imageKey: 'chairComponentsPacked', row: 80 },
      { title: 'Chair components---unpacked', imageKey: 'chairComponentsUnpacked', row: 80 },
      { title: 'Fitting pack---packed', imageKey: 'fittingPackPacked', row: 92 },  // 从87改为92
      { title: 'Fitting pack---unpacked', imageKey: 'fittingPackUnpacked', row: 92 },  // 从87改为92
      { title: 'Production label', imageKey: 'productionLabel', row: 104 },  // 从94改为104
      { title: 'Assembly instructions', imageKey: 'assemblyInstructions', row: 104 }  // 从94改为104
    ]

    // 添加第三页图片区域
    for (let i = 0; i < thirdPageImageAreas.length; i++) {
      const area = thirdPageImageAreas[i]
      const isLeftSide = i % 2 === 0
      const colStart = isLeftSide ? 4 : 11  // D列或K列
      const colEnd = isLeftSide ? 9 : 16    // I列或P列

      // 添加标题
      const titleRow = summaryWorksheet.getRow(area.row)
      titleRow.height = 10  // 从12减少到10
      const titleCell = titleRow.getCell(colStart)
      titleCell.value = area.title
      titleCell.font = { name: 'Arial', size: 11, bold: true }
      titleCell.alignment = { vertical: 'bottom', horizontal: 'left' }

      // 添加图片框
      const imageRow = area.row + 1
      const imageRowEnd = area.row + 11  // 从8行减少到6行
      for (let col = colStart; col <= colEnd; col++) {
        const topCell = summaryWorksheet.getCell(imageRow, col)
        const bottomCell = summaryWorksheet.getCell(imageRowEnd, col)
        topCell.border = { ...topCell.border, top: blackBorderStyle }
        bottomCell.border = { ...bottomCell.border, bottom: blackBorderStyle }
      }
      for (let row = imageRow; row <= imageRowEnd; row++) {
        const leftCell = summaryWorksheet.getCell(row, colStart)
        const rightCell = summaryWorksheet.getCell(row, colEnd)
        leftCell.border = { ...leftCell.border, left: blackBorderStyle }
        rightCell.border = { ...rightCell.border, right: blackBorderStyle }
      }

      // 如果有图片数据，添加图片
      if (data[area.imageKey]) {
        const imageUrl = data[area.imageKey]
        if (typeof imageUrl === 'string') {
          const processedImage = await processImage(imageUrl, workbook, colStart, colEnd, imageRow)
          if (processedImage) {
            summaryWorksheet.addImage(processedImage.imageId, processedImage.position)
          }
        }
      }
    }

    // 添加空行分隔第三页和第四页
    const emptyRow3 = summaryWorksheet.addRow([''])
    emptyRow3.height = 15

    // 设置第四页的深蓝色外边框
    const fourthPageStartRow = 118  // 从122改为118
    const fourthPageEndRow = 154    // 从160改为154

    // 设置第四页边框
    for (let col = startCol; col <= endCol; col++) {
      const cell = summaryWorksheet.getCell(fourthPageStartRow, col)
      cell.border = { ...cell.border, top: blueBorderStyle }
    }
    for (let col = startCol; col <= endCol; col++) {
      const cell = summaryWorksheet.getCell(fourthPageEndRow, col)
      cell.border = { ...cell.border, bottom: blueBorderStyle }
    }
    for (let row = fourthPageStartRow; row <= fourthPageEndRow; row++) {
      const leftCell = summaryWorksheet.getCell(row, startCol)
      const rightCell = summaryWorksheet.getCell(row, endCol)
      leftCell.border = { ...leftCell.border, left: blueBorderStyle }
      rightCell.border = { ...rightCell.border, right: blueBorderStyle }
    }

    // 修改第四页图片区域配置
    interface FourthPageImageArea {
      title: string
      imageKey: keyof Pick<QCReportData,
        'imageOfComponentsSeat' | 'imageOfComponentsBack' |
        'imageOfComponentsBase' | 'imageOfComponentsCastors' |
        'imageOfComponentsGasLiftCover' | 'imageOfComponentsGasLiftStamp'
      >
      row: number
    }

    const fourthPageImageAreas: FourthPageImageArea[] = [
      { title: 'Components---seat', imageKey: 'imageOfComponentsSeat', row: 118 },
      { title: 'Components---back', imageKey: 'imageOfComponentsBack', row: 118 },
      { title: 'Components---base', imageKey: 'imageOfComponentsBase', row: 130 },  // 从125改为130
      { title: 'Components---castors', imageKey: 'imageOfComponentsCastors', row: 130 },  // 从125改为130
      { title: 'Components---gas lift cover', imageKey: 'imageOfComponentsGasLiftCover', row: 142 },  // 从132改为142
      { title: 'Components---gas lift stamp', imageKey: 'imageOfComponentsGasLiftStamp', row: 142 }  // 从132改为142
    ]

    // 添加第四页图片区域
    for (let i = 0; i < fourthPageImageAreas.length; i++) {
      const area = fourthPageImageAreas[i]
      const isLeftSide = i % 2 === 0
      const colStart = isLeftSide ? 4 : 11
      const colEnd = isLeftSide ? 9 : 16

      // 添加标题
      const titleRow = summaryWorksheet.getRow(area.row)
      titleRow.height = 10  // 从12减少到10
      const titleCell = titleRow.getCell(colStart)
      titleCell.value = area.title
      titleCell.font = { name: 'Arial', size: 11, bold: true }
      titleCell.alignment = { vertical: 'bottom', horizontal: 'left' }

      // 添加图片框
      const imageRow = area.row + 1
      const imageRowEnd = area.row + 11  // 从8行减少到6行
      for (let col = colStart; col <= colEnd; col++) {
        const topCell = summaryWorksheet.getCell(imageRow, col)
        const bottomCell = summaryWorksheet.getCell(imageRowEnd, col)
        topCell.border = { ...topCell.border, top: blackBorderStyle }
        bottomCell.border = { ...bottomCell.border, bottom: blackBorderStyle }
      }
      for (let row = imageRow; row <= imageRowEnd; row++) {
        const leftCell = summaryWorksheet.getCell(row, colStart)
        const rightCell = summaryWorksheet.getCell(row, colEnd)
        leftCell.border = { ...leftCell.border, left: blackBorderStyle }
        rightCell.border = { ...rightCell.border, right: blackBorderStyle }
      }

      // 如果有图片数据，添加图片
      if (data[area.imageKey]) {
        const imageUrl = data[area.imageKey]
        if (typeof imageUrl === 'string') {
          const processedImage = await processImage(imageUrl, workbook, colStart, colEnd, imageRow)
          if (processedImage) {
            summaryWorksheet.addImage(processedImage.imageId, processedImage.position)
          }
        }
      }
    }

    // 添加空行分隔第四页和第五页
    const emptyRow4 = summaryWorksheet.addRow([''])
    emptyRow4.height = 15

    // 设置第五页的深蓝色外边框
    const fifthPageStartRow = 156  // 从162改为156
    const fifthPageEndRow = 192    // 从200改为192

    // 设置第五页边框
    for (let col = startCol; col <= endCol; col++) {
      const cell = summaryWorksheet.getCell(fifthPageStartRow, col)
      cell.border = { ...cell.border, top: blueBorderStyle }
    }
    for (let col = startCol; col <= endCol; col++) {
      const cell = summaryWorksheet.getCell(fifthPageEndRow, col)
      cell.border = { ...cell.border, bottom: blueBorderStyle }
    }
    for (let row = fifthPageStartRow; row <= fifthPageEndRow; row++) {
      const leftCell = summaryWorksheet.getCell(row, startCol)
      const rightCell = summaryWorksheet.getCell(row, endCol)
      leftCell.border = { ...leftCell.border, left: blueBorderStyle }
      rightCell.border = { ...rightCell.border, right: blueBorderStyle }
    }

    // 修改第五页图片区域配置
    interface FifthPageImageArea {
      title: string
      imageKey: keyof Pick<QCReportData,
        'imageOfComponentsArmrest' | 'imageOfComponentMechanism' |
        'imageOfComponentsHeadrest' | 'imageOfProductBuiltFront' |
        'imageOfProductBuiltSide' | 'imageOfProductBuiltBack'
      >
      row: number
    }

    const fifthPageImageAreas: FifthPageImageArea[] = [
      { title: 'Components---armrest', imageKey: 'imageOfComponentsArmrest', row: 156 },
      { title: 'Components---mechanism', imageKey: 'imageOfComponentMechanism', row: 156 },
      { title: 'Components---headrest', imageKey: 'imageOfComponentsHeadrest', row: 168 },  // 从163改为168
      { title: 'Product built---front', imageKey: 'imageOfProductBuiltFront', row: 168 },  // 从163改为168
      { title: 'Product built---side', imageKey: 'imageOfProductBuiltSide', row: 180 },  // 从170改为180
      { title: 'Product built---back', imageKey: 'imageOfProductBuiltBack', row: 180 }  // 从170改为180
    ]

    // 添加第五页图片区域
    for (let i = 0; i < fifthPageImageAreas.length; i++) {
      const area = fifthPageImageAreas[i]
      const isLeftSide = i % 2 === 0
      const colStart = isLeftSide ? 4 : 11
      const colEnd = isLeftSide ? 9 : 16

      // 添加标题
      const titleRow = summaryWorksheet.getRow(area.row)
      titleRow.height = 10  // 从12减少到10
      const titleCell = titleRow.getCell(colStart)
      titleCell.value = area.title
      titleCell.font = { name: 'Arial', size: 11, bold: true }
      titleCell.alignment = { vertical: 'bottom', horizontal: 'left' }

      // 添加图片框
      const imageRow = area.row + 1
      const imageRowEnd = area.row + 11  // 从8行减少到6行
      for (let col = colStart; col <= colEnd; col++) {
        const topCell = summaryWorksheet.getCell(imageRow, col)
        const bottomCell = summaryWorksheet.getCell(imageRowEnd, col)
        topCell.border = { ...topCell.border, top: blackBorderStyle }
        bottomCell.border = { ...bottomCell.border, bottom: blackBorderStyle }
      }
      for (let row = imageRow; row <= imageRowEnd; row++) {
        const leftCell = summaryWorksheet.getCell(row, colStart)
        const rightCell = summaryWorksheet.getCell(row, colEnd)
        leftCell.border = { ...leftCell.border, left: blackBorderStyle }
        rightCell.border = { ...rightCell.border, right: blackBorderStyle }
      }

      // 如果有图片数据，添加图片
      if (data[area.imageKey]) {
        const imageUrl = data[area.imageKey]
        if (typeof imageUrl === 'string') {
          const processedImage = await processImage(imageUrl, workbook, colStart, colEnd, imageRow)
          if (processedImage) {
            summaryWorksheet.addImage(processedImage.imageId, processedImage.position)
          }
        }
      }
    }

    // 添加页码到第五页
    const fifthPageCell = summaryWorksheet.getCell('D192')
    fifthPageCell.value = 'Page 5'
    fifthPageCell.font = { name: 'Arial', size: 10 }
    fifthPageCell.alignment = { vertical: 'middle', horizontal: 'left' }

    // 添加空行分隔第五页和第六页
    const emptyRow5 = summaryWorksheet.addRow([''])
    emptyRow5.height = 15

    // 设置第六页的深蓝色外边框
    const sixthPageStartRow = 194  // 从202改为194
    const sixthPageEndRow = 230    // 从240改为230

    // 设置第六页边框
    for (let col = startCol; col <= endCol; col++) {
      const cell = summaryWorksheet.getCell(sixthPageStartRow, col)
      cell.border = { ...cell.border, top: blueBorderStyle }
    }
    for (let col = startCol; col <= endCol; col++) {
      const cell = summaryWorksheet.getCell(sixthPageEndRow, col)
      cell.border = { ...cell.border, bottom: blueBorderStyle }
    }
    for (let row = sixthPageStartRow; row <= sixthPageEndRow; row++) {
      const leftCell = summaryWorksheet.getCell(row, startCol)
      const rightCell = summaryWorksheet.getCell(row, endCol)
      leftCell.border = { ...leftCell.border, left: blueBorderStyle }
      rightCell.border = { ...rightCell.border, right: blueBorderStyle }
    }

    // 修改第六页图片区域配置
    interface SixthPageImageArea {
      title: string
      imageKey: keyof Pick<QCReportData,
        'imageOfProductBuilt45Degree' | 'frontImageOfProductBuiltCompare1' |
        'frontImageOfProductBuiltCompare2' | 'functionCheckSeatHeightExtension' |
        'functionCheckMechanismAdjustment' | 'functionCheckArmrestAdjustment'
      >
      row: number
    }

    const sixthPageImageAreas: SixthPageImageArea[] = [
      { title: 'Product built---45 degree', imageKey: 'imageOfProductBuilt45Degree', row: 194 },
      { title: 'Product built compare 1', imageKey: 'frontImageOfProductBuiltCompare1', row: 194 },
      { title: 'Product built compare 2', imageKey: 'frontImageOfProductBuiltCompare2', row: 206 },  // 从201改为206
      { title: 'Function check---seat height', imageKey: 'functionCheckSeatHeightExtension', row: 206 },  // 从201改为206
      { title: 'Function check---mechanism', imageKey: 'functionCheckMechanismAdjustment', row: 218 },  // 从208改为218
      { title: 'Function check---armrest', imageKey: 'functionCheckArmrestAdjustment', row: 218 }  // 从208改为218
    ]

    // 添加第六页图片区域
    for (let i = 0; i < sixthPageImageAreas.length; i++) {
      const area = sixthPageImageAreas[i]
      const isLeftSide = i % 2 === 0
      const colStart = isLeftSide ? 4 : 11
      const colEnd = isLeftSide ? 9 : 16

      // 添加标题
      const titleRow = summaryWorksheet.getRow(area.row)
      titleRow.height = 10  // 从12减少到10
      const titleCell = titleRow.getCell(colStart)
      titleCell.value = area.title
      titleCell.font = { name: 'Arial', size: 11, bold: true }
      titleCell.alignment = { vertical: 'bottom', horizontal: 'left' }

      // 添加图片框
      const imageRow = area.row + 1
      const imageRowEnd = area.row + 11  // 从8行减少到6行
      for (let col = colStart; col <= colEnd; col++) {
        const topCell = summaryWorksheet.getCell(imageRow, col)
        const bottomCell = summaryWorksheet.getCell(imageRowEnd, col)
        topCell.border = { ...topCell.border, top: blackBorderStyle }
        bottomCell.border = { ...bottomCell.border, bottom: blackBorderStyle }
      }
      for (let row = imageRow; row <= imageRowEnd; row++) {
        const leftCell = summaryWorksheet.getCell(row, colStart)
        const rightCell = summaryWorksheet.getCell(row, colEnd)
        leftCell.border = { ...leftCell.border, left: blackBorderStyle }
        rightCell.border = { ...rightCell.border, right: blackBorderStyle }
      }

      // 如果有图片数据，添加图片
      if (data[area.imageKey]) {
        const imageUrl = data[area.imageKey]
        if (typeof imageUrl === 'string') {
          const processedImage = await processImage(imageUrl, workbook, colStart, colEnd, imageRow)
          if (processedImage) {
            summaryWorksheet.addImage(processedImage.imageId, processedImage.position)
          }
        }
      }
    }

    // 添加页码到第六页
    const sixthPageCell = summaryWorksheet.getCell('D230')
    sixthPageCell.value = 'Page 6'
    sixthPageCell.font = { name: 'Arial', size: 10 }
    sixthPageCell.alignment = { vertical: 'middle', horizontal: 'left' }

    // 添加空行分隔第六页和第七页
    const emptyRow6 = summaryWorksheet.addRow([''])
    emptyRow6.height = 15

    // 设置第七页的深蓝色外边框
    const seventhPageStartRow = 232  // 从242改为232
    const seventhPageEndRow = 268    // 从280改为268

    // 设置第七页边框
    for (let col = startCol; col <= endCol; col++) {
      const cell = summaryWorksheet.getCell(seventhPageStartRow, col)
      cell.border = { ...cell.border, top: blueBorderStyle }
    }
    for (let col = startCol; col <= endCol; col++) {
      const cell = summaryWorksheet.getCell(seventhPageEndRow, col)
      cell.border = { ...cell.border, bottom: blueBorderStyle }
    }
    for (let row = seventhPageStartRow; row <= seventhPageEndRow; row++) {
      const leftCell = summaryWorksheet.getCell(row, startCol)
      const rightCell = summaryWorksheet.getCell(row, endCol)
      leftCell.border = { ...leftCell.border, left: blueBorderStyle }
      rightCell.border = { ...rightCell.border, right: blueBorderStyle }
    }

    // 修改第七页图片区域配置
    interface SeventhPageImageArea {
      title: string
      imageKey: keyof Pick<QCReportData,
        'functionCheckHeadrestAdjustment' | 'functionCheckOther1' |
        'functionCheckOther2'
      >
      row: number
    }

    const seventhPageImageAreas: SeventhPageImageArea[] = [
      { title: 'Function check---headrest', imageKey: 'functionCheckHeadrestAdjustment', row: 232 },
      { title: 'Function check---other 1', imageKey: 'functionCheckOther1', row: 232 },
      { title: 'Function check---other 2', imageKey: 'functionCheckOther2', row: 244 }  // 从239改为244
    ]

    // 添加第七页图片区域
    for (let i = 0; i < seventhPageImageAreas.length; i++) {
      const area = seventhPageImageAreas[i]
      const isLeftSide = i % 2 === 0
      const colStart = isLeftSide ? 4 : 11
      const colEnd = isLeftSide ? 9 : 16

      // 添加标题
      const titleRow = summaryWorksheet.getRow(area.row)
      titleRow.height = 10  // 从12减少到10
      const titleCell = titleRow.getCell(colStart)
      titleCell.value = area.title
      titleCell.font = { name: 'Arial', size: 11, bold: true }
      titleCell.alignment = { vertical: 'bottom', horizontal: 'left' }

      // 添加图片框
      const imageRow = area.row + 1  // 标题行的下一行开始
      const imageRowEnd = area.row + 11  // 从8行减少到6行
      for (let col = colStart; col <= colEnd; col++) {
        const topCell = summaryWorksheet.getCell(imageRow, col)
        const bottomCell = summaryWorksheet.getCell(imageRowEnd, col)
        topCell.border = { ...topCell.border, top: blackBorderStyle }
        bottomCell.border = { ...bottomCell.border, bottom: blackBorderStyle }
      }
      for (let row = imageRow; row <= imageRowEnd; row++) {
        const leftCell = summaryWorksheet.getCell(row, colStart)
        const rightCell = summaryWorksheet.getCell(row, colEnd)
        leftCell.border = { ...leftCell.border, left: blackBorderStyle }
        rightCell.border = { ...rightCell.border, right: blackBorderStyle }
      }

      // 如果有图片数据，添加图片
      if (data[area.imageKey]) {
        const imageUrl = data[area.imageKey]
        if (typeof imageUrl === 'string') {
          const processedImage = await processImage(imageUrl, workbook, colStart, colEnd, imageRow)
          if (processedImage) {
            summaryWorksheet.addImage(processedImage.imageId, processedImage.position)
          }
        }
      }
    }

    // 添加页码到第七页
    const seventhPageCell = summaryWorksheet.getCell('D268')
    seventhPageCell.value = 'Page 7'
    seventhPageCell.font = { name: 'Arial', size: 10 }
    seventhPageCell.alignment = { vertical: 'middle', horizontal: 'left' }

    // 创建 Defects finding sheet
    if (data.defects) {
      await createDefectsFindingSheet(workbook, data.defects)
    }

    // 返回 workbook 对象
    return workbook
  } catch (error: unknown) {
    console.error('创建报告时出错:', error)
    throw new Error(`创建报告失败: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// 修改图片处理函数，使每个图片正确定位在其对应的图片框内
const processImage = async (imageUrl: string, workbook: ExcelJS.Workbook, colStart: number, colEnd: number, imageRow: number) => {
  const imageBuffer = await getImageBuffer(imageUrl)
  if (!imageBuffer) return null

  try {
    const imageId = workbook.addImage({
      buffer: imageBuffer,
      extension: 'jpeg'
    })

    // 获取图片实际尺寸
    const dimensions = await getImageDimensions(imageBuffer)
    
    // 单位转换常量
    const INCH_TO_PIXEL = 96        // 1英寸 = 96像素
    const PIXELS_PER_COLUMN = 64    // Excel 中每列的默认宽度（像素）
    const PIXELS_PER_ROW = 20       // Excel 中每行的默认高度（像素）
    const MAX_SIZE_INCHES = 2.92    // 最大尺寸2.92英寸
    const FRAME_WIDTH_INCHES = 2.98  // 图片框宽度2.98英寸
    const FRAME_HEIGHT_INCHES = 3.04 // 图片框高度3.04英寸

    // 计算图片的宽高比
    const imageAspectRatio = dimensions.width / dimensions.height

    // 计算最终尺寸（考虑最大值限制）
    let finalWidth: number
    let finalHeight: number

    if (imageAspectRatio > 1) {
      // 宽图：以宽度为基准
      finalWidth = MAX_SIZE_INCHES * INCH_TO_PIXEL
      finalHeight = finalWidth / imageAspectRatio
    } else {
      // 高图：以高度为基准
      finalHeight = MAX_SIZE_INCHES * INCH_TO_PIXEL
      finalWidth = finalHeight * imageAspectRatio
    }

    // 计算图片框的总宽度（以像素为单位）
    const frameWidthColumns = colEnd - colStart + 1  // 总列数
    const frameWidthPixels = frameWidthColumns * PIXELS_PER_COLUMN

    // 计算水平居中的偏移量
    const horizontalOffset = (frameWidthPixels - finalWidth) / (2 * PIXELS_PER_COLUMN)

    // 计算垂直居中的偏移量（转换为Excel行单位）
    const frameHeightPixels = FRAME_HEIGHT_INCHES * INCH_TO_PIXEL
    const verticalOffsetPixels = (frameHeightPixels - finalHeight) / 2
    const verticalOffset = verticalOffsetPixels / PIXELS_PER_ROW

    // 返回图片配置
    return {
      imageId,
      position: {
        tl: { 
          col: colStart - 1 + horizontalOffset,  // 从起始列开始，加上水平偏移
          row: imageRow - 1 + verticalOffset  // 行位置加上垂直偏移
        },
        ext: { 
          width: finalWidth,
          height: finalHeight
        }
      } as ImagePosition
    }
  } catch (error) {
    console.warn(`处理图片失败: ${imageUrl}`, error)
    return null
  }
} 