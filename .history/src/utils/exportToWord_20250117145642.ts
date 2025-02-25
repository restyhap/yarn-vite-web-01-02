import { Document, Paragraph, Table, TableRow, TableCell, HeadingLevel, WidthType, ImageRun } from 'docx'
import { saveAs } from 'file-saver'
import { Packer } from 'docx'

// 统一表格宽度配置
const TABLE_WIDTH = {
  width: 9026,
  type: WidthType.DXA
}

// 统一单元格宽度配置
const CELL_WIDTHS = {
  label: {
    width: 3026,
    type: WidthType.DXA
  },
  content: {
    width: 6000,
    type: WidthType.DXA
  }
}

// 创建表格行
const createTableRow = (label: string, value: string | undefined, hasShading = true) => {
  return new TableRow({
    children: [
      new TableCell({
        width: CELL_WIDTHS.label,
        children: [new Paragraph(label)],
        shading: hasShading ? { fill: 'F0F0F0' } : undefined
      }),
      new TableCell({
        width: CELL_WIDTHS.content,
        children: [new Paragraph(value || '')]
      }),
    ],
  })
}

// 创建表格
const createTable = (title: string, data: Record<string, any>) => {
  const rows = Object.entries(data).map(([key, value]) => 
    createTableRow(key, String(value))
  )

  return new Table({
    width: TABLE_WIDTH,
    rows: rows
  })
}

// 创建表格标题
const createSectionTitle = (title: string) => {
  return new Paragraph({
    text: title,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 }
  })
}

// 将图片URL转换为Base64
const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error converting image to base64:', error)
    return ''
  }
}

// 创建图片部分
const createImagesSection = async (images: Record<string, string>) => {
  const imageRows = []
  const imagesPerRow = 2
  const imageWidth = 250
  const imageHeight = 250

  // 将图片分组，每行两张
  for (let i = 0; i < Object.entries(images).length; i += imagesPerRow) {
    const rowImages = Object.entries(images).slice(i, i + imagesPerRow)
    const cells = []

    for (const [key, url] of rowImages) {
      try {
        const base64Data = await urlToBase64(url)
        if (base64Data) {
          cells.push(
            new TableCell({
              width: {
                size: 4513,
                type: WidthType.DXA
              },
              children: [
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: base64Data.split(',')[1],
                      transformation: {
                        width: imageWidth,
                        height: imageHeight
                      }
                    })
                  ],
                  alignment: 'center'
                }),
                new Paragraph({
                  text: key.replace(/_path$/, '').replace(/_/g, ' ').toUpperCase(),
                  alignment: 'center'
                })
              ],
              verticalAlign: 'center'
            })
          )
        }
      } catch (error) {
        console.error(`Error processing image ${key}:`, error)
      }
    }

    // 如果这行图片不足两张，添加空单元格
    while (cells.length < imagesPerRow) {
      cells.push(
        new TableCell({
          width: {
            size: 4513,
            type: WidthType.DXA
          },
          children: [new Paragraph('')]
        })
      )
    }

    imageRows.push(new TableRow({ children: cells }))
  }

  return new Table({
    width: TABLE_WIDTH,
    rows: imageRows
  })
}

export const exportToWord = async (data: any) => {
  try {
    const sections = []

    // 添加标题
    sections.push(
      new Paragraph({
        text: '产品规格详情',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 }
      })
    )

    // 基本信息表
    sections.push(createSectionTitle('基本信息'))
    sections.push(createTable('基本信息', {
      '产品代码': data.tccode,
      '供应商': data.supplier,
      '供应商代码': data.supplier_code,
      '供应商名称': data.supplier_name,
      '防火标准': data.fire_standard,
      '20尺柜FOB价格': data.fob_20_container_price,
      '40尺柜FOB价格': data.fob_40_container_price,
      '发货港口': data.shipping_port
    }))

    // 其他表格
    const tableSections = [
      { title: '面料信息', key: 'upholstery' },
      { title: '包装信息', key: 'packaging' },
      { title: '物流信息', key: 'logistics' },
      { title: '产品尺寸', key: 'dimensions' },
      { title: '座椅内部结构', key: 'seat_inner' },
      { title: '背部内部结构', key: 'back_inner' },
      { title: '座椅外部结构', key: 'seat_outer' },
      { title: '背部外部结构', key: 'back_outer' },
      { title: '扶手信息', key: 'arms' },
      { title: '泡棉信息', key: 'foam' },
      { title: '脚轮信息', key: 'castors' },
      { title: '底座信息', key: 'base' },
      { title: '气压棒信息', key: 'gas_lift' },
      { title: '气压罩信息', key: 'gas_lift_cover' },
      { title: '机构信息', key: 'mechanism' },
      { title: '配件信息', key: 'fittings' }
    ]

    for (const section of tableSections) {
      if (data[section.key]) {
        sections.push(createSectionTitle(section.title))
        sections.push(createTable(section.title, data[section.key]))
      }
    }

    // 添加图片部分
    if (data.images) {
      sections.push(createSectionTitle('产品图片'))
      sections.push(await createImagesSection(data.images))
    }

    // 创建文档
    const doc = new Document({
      sections: [{
        properties: {},
        children: sections
      }]
    })

    // 生成并下载文档
    const blob = await Packer.toBlob(doc)
    saveAs(blob, '产品规格详情.docx')
  } catch (error) {
    console.error('导出文档失败:', error)
    throw error
  }
}
