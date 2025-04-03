/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-02-04 10:47:16
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-02-05 09:21:17
 * @FilePath: /yarn-vite-web-01-02/src/utils/exportDefectsFinding.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import ExcelJS from 'exceljs'

// 警告图标的 base64 编码
const ALERT_ICON = 'data:image/png;base64,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'

interface QCReportDefect {
  defectTitle: string
  defectDescription: string
  improvementSuggestion: string
  inspector: string
  images: string[]
}

/**
 * 获取图片的二进制数据
 * @param url - 图片URL
 * @returns Promise<Uint8Array | null> - 返回图片的二进制数据
 */
const getImageBuffer = async (url: string): Promise<Uint8Array | null> => {
  try {
    // 对于测试图片路径，直接返回null不尝试获取
    if (url.includes('img.shetu66.com')) {
      console.log('跳过测试图片:', url)
      return null
    }
    
    // 尝试获取图片
    console.log('正在获取图片:', { url })
    const response = await fetch(url)
    
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

// 获取图片尺寸
const getImageDimensions = (imageBuffer: Uint8Array): Promise<{ width: number; height: number }> => {
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
  defect: QCReportDefect,
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
  const imageAreaRow = worksheet.addRow(['', '', 'Image1', '', '', defect.images.length > 1 ? 'Image2' : '', '', ''])
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

  // 只有当有第二张图片时才设置第二个图片区域
  if (defect.images.length > 1) {
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
    // 添加第一张图片
    const imageUrl = defect.images[0]
    const imageBuffer = await getImageBuffer(imageUrl)
    
    if (imageBuffer) {
      try {
        const imageId = workbook.addImage({
          buffer: imageBuffer,
          extension: 'jpeg',
        })

        // 获取图片实际尺寸
        const dimensions = await getImageDimensions(imageBuffer)
        
        // 计算单元格可用空间（2.58英寸宽度）
        const INCH_TO_PIXEL = 96       // 1英寸 = 96像素
        const targetWidth = 2.58 * INCH_TO_PIXEL  // 约247.68像素
        
        // 计算等比缩放后的高度
        const aspectRatio = dimensions.width / dimensions.height
        const finalWidth = targetWidth
        const finalHeight = targetWidth / aspectRatio

        worksheet.addImage(imageId, {
          tl: { col: 3, row: imageAreaRow.number - 0.95 },
          ext: { width: finalWidth, height: finalHeight }
        })
      } catch (error) {
        console.warn(`添加图片失败: ${imageUrl}`, error)
      }
    }

    // 只有当有第二张图片时才添加
    if (defect.images.length > 1) {
      const imageUrl = defect.images[1]
      const imageBuffer = await getImageBuffer(imageUrl)
      
      if (imageBuffer) {
        try {
          const imageId = workbook.addImage({
            buffer: imageBuffer,
            extension: 'jpeg',
          })

          // 获取图片实际尺寸
          const dimensions = await getImageDimensions(imageBuffer)
          
          // 计算单元格可用空间（2.58英寸宽度）
          const INCH_TO_PIXEL = 96       // 1英寸 = 96像素
          const targetWidth = 2.58 * INCH_TO_PIXEL  // 约247.68像素
          
          // 计算等比缩放后的高度
          const aspectRatio = dimensions.width / dimensions.height
          const finalWidth = targetWidth
          const finalHeight = targetWidth / aspectRatio

          worksheet.addImage(imageId, {
            tl: { col: 6, row: imageAreaRow.number - 0.95 },
            ext: { width: finalWidth, height: finalHeight }
          })
        } catch (error) {
          console.warn(`添加图片失败: ${imageUrl}`, error)
        }
      }
    }
  }
}

export const createDefectsFindingSheet = async (
  workbook: ExcelJS.Workbook,
  defects: QCReportDefect[]
) => {
  const defectsWorksheet = workbook.addWorksheet('Defects finding', {
    pageSetup: {
      paperSize: 9, // A4 纸
      orientation: 'portrait',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0
    },
    properties: {
      defaultRowHeight: 15,
      defaultColWidth: 8.43
    }
  })

  // 设置列宽
  defectsWorksheet.columns = [
    { width: 4 },   // A - 左边距
    { width: 4 },   // B - 警告图标
    { width: 10 },  // C - 第一个图片区域左侧（Image1标签）
    { width: 35 },  // D - 第一个图片区域右侧
    { width: 8 },   // E - 间隔
    { width: 10 },  // F - 第二个图片区域左侧（Image2标签）
    { width: 35 },  // G - 第二个图片区域右侧
    { width: 4 }    // H - 右边距
  ]

  // 添加一个空行作为第一行
  defectsWorksheet.addRow([''])

  // 添加Defects finding数据
  const headerRow = defectsWorksheet.addRow(['', '', 'Defects Finding', '', '', '', '', ''])
  headerRow.height = 40
  const headerCell = headerRow.getCell(3)
  headerCell.font = { 
    name: 'Arial', 
    size: 24,
    bold: true 
  }
  headerCell.alignment = {
    vertical: 'middle',
    horizontal: 'left'
  }
  defectsWorksheet.mergeCells(`C${headerRow.number}:G${headerRow.number}`)

  // 定义蓝色边框样式
  const blueBorderStyle = { style: 'medium' as const, color: { argb: 'FF0000FF' } }

  // 设置第一行的上边框
  for (let col = 2; col <= 8; col++) {
    const cell = headerRow.getCell(col)
    cell.border = {
      ...cell.border,
      top: blueBorderStyle
    }
  }

  if (defects && defects.length > 0) {
    // 添加警告图标
    const alertImageBuffer = await getImageBuffer(ALERT_ICON)
    if (!alertImageBuffer) {
      console.warn('警告图标加载失败')
      return false
    }

    const alertImageId = workbook.addImage({
      buffer: alertImageBuffer,
      extension: 'png',
    })

    // 每两个问题为一组
    for (let i = 0; i < defects.length; i += 2) {
      // 如果是第二个及以后的组，添加分页符
      if (i > 0) {
        // 添加分页符
        defectsWorksheet.addRow([''])
        const pageBreakRow = defectsWorksheet.lastRow!
        pageBreakRow.addPageBreak()
        
        // 添加额外的空行来增加间距
        defectsWorksheet.addRow([''])
        defectsWorksheet.addRow([''])  // 增加一行空白
        defectsWorksheet.addRow([''])

        // 在第一页最后添加下边框（第15行）
        const firstPageLastRow = 15
        for (let col = 2; col <= 8; col++) {
          const cell = defectsWorksheet.getCell(firstPageLastRow, col)
          cell.border = {
            ...cell.border,
            bottom: blueBorderStyle
          }
        }
        
        // 在新页面添加标题（第18行）
        const newPageHeaderRow = defectsWorksheet.addRow(['', '', 'Defects Finding', '', '', '', '', ''])
        newPageHeaderRow.height = 40
        const newPageHeaderCell = newPageHeaderRow.getCell(3)
        newPageHeaderCell.font = { 
          name: 'Arial', 
          size: 24,
          bold: true 
        }
        newPageHeaderCell.alignment = {
          vertical: 'middle',
          horizontal: 'left'
        }
        defectsWorksheet.mergeCells(`C${newPageHeaderRow.number}:G${newPageHeaderRow.number}`)

        // 设置新页面标题行的上边框
        for (let col = 2; col <= 8; col++) {
          const cell = newPageHeaderRow.getCell(col)
          cell.border = {
            ...cell.border,
            top: blueBorderStyle
          }
        }
      }

      // 添加第一个问题
      await addDefectSection(defectsWorksheet, defects[i], alertImageId, workbook)

      // 如果存在第二个问题，添加第二个问题
      if (i + 1 < defects.length) {
        defectsWorksheet.addRow([''])  // 添加一个空行作为分隔
        await addDefectSection(defectsWorksheet, defects[i + 1], alertImageId, workbook)
      }

      // 添加页脚
      const footerRow = defectsWorksheet.addRow([''])
      footerRow.height = 30
      defectsWorksheet.mergeCells(`C${footerRow.number}:G${footerRow.number}`)
      const footerCell = footerRow.getCell(3)
      footerCell.value = 'Page ' + (Math.floor(i / 2) + 1)
      footerCell.font = { name: 'Arial', size: 10 }
      footerCell.alignment = { vertical: 'middle', horizontal: 'right' }
    }
  } else {
    defectsWorksheet.addRow(['', '', 'No defects found', '', '', '', '', ''])
  }

  // 设置整体样式
  defectsWorksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      if (!cell.value) return
      
      // 设置默认字体
      cell.font = cell.font || { name: 'Arial', size: 11 }
      
      // 设置对齐方式
      cell.alignment = { 
        vertical: 'middle', 
        horizontal: 'left',
        wrapText: true
      }
      
      // 设置白色背景
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' }
      }
    })
  })

  // 添加整页的蓝色外框
  const lastRow = defectsWorksheet.lastRow?.number || 1

  // 设置B列到H列的外框
  for (let col = 2; col <= 8; col++) {  // 从B列(2)到H列(8)
    // 第一行的上边框
    const topCell = defectsWorksheet.getCell(2, col)  // 从第2行开始设置上边框
    topCell.border = {
      ...topCell.border,
      top: blueBorderStyle
    }

    // 最后一行的下边框
    const bottomCell = defectsWorksheet.getCell(lastRow, col)
    bottomCell.border = {
      ...bottomCell.border,
      bottom: blueBorderStyle
    }
  }

  // 设置B列和H列的左右边框
  for (let row = 2; row <= lastRow; row++) {  // 从第2行开始
    // 跳过第16-18行的左右边框
    if (row >= 16 && row <= 18) continue;

    // B列的左边框
    const leftCell = defectsWorksheet.getCell(row, 2)  // B列
    leftCell.border = {
      ...leftCell.border,
      left: blueBorderStyle
    }

    // H列的右边框
    const rightCell = defectsWorksheet.getCell(row, 8)  // H列
    rightCell.border = {
      ...rightCell.border,
      right: blueBorderStyle
    }
  }

  return true
}
