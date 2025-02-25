import { Document, Paragraph, Table, TableRow, TableCell, HeadingLevel, WidthType, ImageRun } from 'docx'
import { saveAs } from 'file-saver'
import { Packer } from 'docx'

// 统一表格宽度配置
const TABLE_WIDTH = {
  size: 9026,
  type: WidthType.DXA
}

// 统一单元格宽度配置
const CELL_WIDTHS = {
  // 三列表格的宽度配置
  three_columns: {
    first: {
      size: 2000,
      type: WidthType.DXA
    },
    second: {
      size: 2000,
      type: WidthType.DXA
    },
    third: {
      size: 5026,
      type: WidthType.DXA
    }
  },
  // 两列表格的宽度配置
  two_columns: {
    label: {
      size: 3026,
      type: WidthType.DXA
    },
    content: {
      size: 6000,
      type: WidthType.DXA
    }
  }
}

// 创建三列表格行
const createThreeColumnRow = (first: string, second: string, third: string, hasShading = true) => {
  return new TableRow({
    children: [
      new TableCell({
        width: CELL_WIDTHS.three_columns.first,
        children: [new Paragraph(first || '')],
        shading: hasShading ? { fill: 'F0F0F0' } : undefined
      }),
      new TableCell({
        width: CELL_WIDTHS.three_columns.second,
        children: [new Paragraph(second || '')],
        shading: hasShading ? { fill: 'F0F0F0' } : undefined
      }),
      new TableCell({
        width: CELL_WIDTHS.three_columns.third,
        children: [new Paragraph(third || '')]
      })
    ]
  })
}

// 创建两列表格行
const createTwoColumnRow = (label: string, value: any, hasShading = true) => {
  const displayValue = value === undefined || value === null ? '' : String(value)
  
  return new TableRow({
    children: [
      new TableCell({
        width: CELL_WIDTHS.two_columns.label,
        children: [new Paragraph(label)],
        shading: hasShading ? { fill: 'F0F0F0' } : undefined
      }),
      new TableCell({
        width: CELL_WIDTHS.two_columns.content,
        children: [new Paragraph(displayValue)]
      })
    ]
  })
}

// 创建基本信息表格
const createBasicInfoTable = (data: Record<string, any>) => {
  if (!data || typeof data !== 'object') {
    return new Table({
      width: TABLE_WIDTH,
      rows: [createTwoColumnRow('错误', '无效数据')]
    })
  }

  const rows = [
    createTwoColumnRow('产品代码', data.tccode),
    createTwoColumnRow('供应商', data.supplier),
    createTwoColumnRow('供应商代码', data.supplier_code),
    createTwoColumnRow('供应商名称', data.supplier_name),
    createTwoColumnRow('防火标准', data.fire_standard),
    createTwoColumnRow('20尺柜FOB价格', data.fob_20_container_price),
    createTwoColumnRow('40尺柜FOB价格', data.fob_40_container_price),
    createTwoColumnRow('发货港口', data.shipping_port)
  ]

  return new Table({
    width: TABLE_WIDTH,
    rows: rows
  })
}

// 创建三列表格
const createThreeColumnTable = (title: string, data: Record<string, any>) => {
  if (!data || typeof data !== 'object') {
    return new Table({
      width: TABLE_WIDTH,
      rows: [createThreeColumnRow('错误', '', '无效数据')]
    })
  }

  const rows = Object.entries(data).map(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      return createThreeColumnRow(
        key,
        value.specification || '',
        value.description || ''
      )
    }
    return createThreeColumnRow(key, '', String(value))
  })

  return new Table({
    width: TABLE_WIDTH,
    rows: rows
  })
}

// 创建两列表格
const createTwoColumnTable = (title: string, data: Record<string, any>) => {
  if (!data || typeof data !== 'object') {
    return new Table({
      width: TABLE_WIDTH,
      rows: [createTwoColumnRow('错误', '无效数据')]
    })
  }

  const rows = Object.entries(data).map(([key, value]) => 
    createTwoColumnRow(key, value)
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

  if (!images || typeof images !== 'object') {
    return new Table({
      width: TABLE_WIDTH,
      rows: [createTwoColumnRow('错误', '无效的图片数据')]
    })
  }

  const imageEntries = Object.entries(images)
  for (let i = 0; i < imageEntries.length; i += imagesPerRow) {
    const rowImages = imageEntries.slice(i, i + imagesPerRow)
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
                      },
                      type: 'png'
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
        cells.push(
          new TableCell({
            width: {
              size: 4513,
              type: WidthType.DXA
            },
            children: [new Paragraph('图片加载失败')]
          })
        )
      }
    }

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
    if (!data || typeof data !== 'object') {
      throw new Error('无效的输入数据')
    }

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
    sections.push(createBasicInfoTable(data))

    // 两列表格部分
    const twoColumnSections = [
      { title: '包装信息', key: 'packaging' },
      { title: '物流信息', key: 'logistics' },
      { title: '产品尺寸', key: 'dimensions' }
    ]

    for (const section of twoColumnSections) {
      if (data[section.key]) {
        sections.push(createSectionTitle(section.title))
        sections.push(createTwoColumnTable(section.title, data[section.key]))
      }
    }

    // 三列表格部分
    const threeColumnSections = [
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

    for (const section of threeColumnSections) {
      if (data[section.key]) {
        sections.push(createSectionTitle(section.title))
        sections.push(createThreeColumnTable(section.title, data[section.key]))
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
