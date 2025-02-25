import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, AlignmentType, HeadingLevel, BorderStyle } from 'docx'
import { saveAs } from 'file-saver'

/**
 * 表单数据接口定义
 * 使用索引签名允许任意字符串键
 */
interface FormData {
  [key: string]: any
}

/**
 * 创建表格行
 * @param label - 左侧标签文本
 * @param value - 右侧值文本
 * @param hasShading - 是否添加背景色，默认为 true
 * @returns TableRow - 返回一个表格行对象
 */
const createTableRow = (label: string, value: string | undefined, hasShading = true) => {
  return new TableRow({
    children: [
      new TableCell({
        width: {
          size: 40,  // 左侧单元格宽度占40%
          type: 'pct',
        },
        children: [new Paragraph(label)],
        shading: hasShading ? { fill: 'F0F0F0' } : undefined  // 设置背景色为浅灰色
      }),
      new TableCell({
        width: {
          size: 60,  // 右侧单元格宽度占60%
          type: 'pct',
        },
        children: [new Paragraph(value || '')]  // 如果值为undefined，显示空字符串
      }),
    ],
  })
}

/**
 * 创建表格标题
 * @param title - 标题文本
 * @returns Paragraph - 返回一个段落对象，作为表格标题
 */
const createSectionTitle = (title: string) => {
  return new Paragraph({
    text: title,
    heading: HeadingLevel.HEADING_2,  // 使用二级标题样式
    spacing: { before: 400, after: 200 }  // 设置标题前后的间距
  })
}

/**
 * 创建表格
 * @param rows - 表格行数组
 * @param tableWidth - 表格宽度百分比，默认为100%
 * @returns Table - 返回一个表格对象
 */
const createTable = (rows: TableRow[], tableWidth: number = 100) => {
  return new Table({
    width: {
      size: tableWidth,  // 设置表格宽度
      type: 'pct',  // 使用百分比单位
    },
    alignment: AlignmentType.CENTER,  // 表格居中对齐
    rows
  })
}

/**
 * 创建合并单元格的表格行
 * @param label - 标签文本
 * @param value - 值文本
 * @param hasShading - 是否添加背景色，默认为 true
 * @param colSpan - 需要合并的列数，默认为 1（不合并）
 * @returns TableRow - 返回一个表格行对象
 */
const createMergedTableRow = (label: string, value: string | undefined, hasShading = true, colSpan = 1) => {
  return new TableRow({
    children: [
      new TableCell({
        width: {
          size: 30,
          type: 'pct',
        },
        children: [new Paragraph(label)],
        shading: hasShading ? { fill: 'F0F0F0' } : undefined,
        columnSpan: colSpan  // 设置列合并数
      }),
      // 如果不需要合并列，则添加第二个单元格
      ...(colSpan === 1 ? [new TableCell({
        children: [new Paragraph(value || '')]
      })] : [])
    ],
  })
}

/**
 * 创建 CARTON 表格的特殊行
 * @param label - 标签文本
 * @param value - 值文本
 * @param isHeader - 是否是表头行
 * @returns TableRow - 返回一个表格行对象
 */
const createCartonTableRow = (label: string, value: string | undefined, isHeader = false) => {
  if (isHeader) {
    // 第一行：CARTON 标题行
    return new TableRow({
      children: [
        new TableCell({
          width: {
            size: 33,
            type: 'pct',
          },
          children: [
            new Paragraph({
              text: 'CARTON (MINIMUM TWIN WALLED CARDBOARD WITH DIVIDERS)',
              alignment: AlignmentType.CENTER
            })
          ],
          verticalAlign: 'center',
          shading: { fill: 'F0F0F0' }
        }),
        new TableCell({
          width: {
            size: 34,
            type: 'pct',
          },
          children: [
            new Paragraph({
              text: 'DIMENSIONS',
              alignment: AlignmentType.CENTER
            })
          ],
          verticalAlign: 'center',
          shading: { fill: 'F0F0F0' }
        }),
        new TableCell({
          width: {
            size: 16.5,
            type: 'pct',
          },
          children: [new Paragraph({
            text: label,
            alignment: AlignmentType.CENTER
          })],
          verticalAlign: 'center',
          shading: { fill: 'F0F0F0' }
        }),
        new TableCell({
          width: {
            size: 16.5,
            type: 'pct',
          },
          children: [new Paragraph({
            text: value || '',
            alignment: AlignmentType.CENTER
          })],
          verticalAlign: 'center'
        })
      ]
    })
  } else {
    // 后续行
    return new TableRow({
      children: [
        new TableCell({
          columnSpan: 6,
          width: {
            size: 67,
            type: 'pct',
          },
          children: [new Paragraph('')],
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.SINGLE }
          }
        }),
        new TableCell({
          width: {
            size: 16.5,
            type: 'pct',
          },
          columnSpan: 6,
          children: [new Paragraph({
            text: label,
            alignment: AlignmentType.CENTER
          })],
          shading: { fill: 'F0F0F0' }
        }),
        new TableCell({
          width: {
            size: 16.5,
            type: 'pct',
          },
          children: [new Paragraph({
            text: value || '',
            alignment: AlignmentType.CENTER
          })]
        })
      ]
    })
  }
}

/**
 * 创建 UPHOLSTERY 表格的特殊行
 * @param label - 标签文本
 * @param value - 值文本
 * @param isHeader - 是否是标题行
 * @returns TableRow - 返回一个表格行对象
 */
const createUpholsteryTableRow = (label: string, value: string | undefined, isHeader = false) => {
  if (isHeader) {
    return new TableRow({
      children: [
        new TableCell({
          rowSpan: 4,
          width: {
            size: 25,
            type: 'pct',
          },
          children: [
            new Paragraph({
              text: 'UPHOLSTERY',
              alignment: AlignmentType.CENTER
            })
          ],
          verticalAlign: 'center',
          shading: { fill: 'F0F0F0' }
        }),
        new TableCell({
          width: {
            size: 45,
            type: 'pct',
          },
          children: [new Paragraph({
            text: label,
            alignment: AlignmentType.LEFT
          })],
          shading: { fill: 'F0F0F0' }
        }),
        new TableCell({
          width: {
            size: 30,
            type: 'pct',
          },
          children: [new Paragraph({
            text: value || '',
            alignment: AlignmentType.LEFT
          })]
        })
      ]
    })
  } else {
    return new TableRow({
      children: [
        new TableCell({
          width: {
            size: 45,
            type: 'pct',
          },
          children: [new Paragraph({
            text: label,
            alignment: AlignmentType.LEFT
          })],
          shading: { fill: 'F0F0F0' }
        }),
        new TableCell({
          width: {
            size: 30,
            type: 'pct',
          },
          children: [new Paragraph({
            text: value || '',
            alignment: AlignmentType.LEFT
          })]
        })
      ]
    })
  }
}

/**
 * 导出Word文档
 * @param formData - 包含所有表单数据的对象
 * @returns Promise<boolean> - 返回一个Promise，成功时返回true
 * @throws 导出失败时抛出错误
 */
export const exportToWord = async (formData: FormData) => {
  try {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // 标题
          new Paragraph({
            children: [
              new TextRun({
                text: 'FULL PRODUCT SPECIFICATION SHEET（包装信息表）',
                color: 'FF0000',
                size: 24,
                bold: true,
                underline: {},
                font: 'Arial'
              })
            ],
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),
          // 基本信息表
          createTable([
            createTableRow('TCCODE', formData.tccode),
            createTableRow('SUPPLIER', formData.supplier),
            createTableRow('SUPPLIER CODE', formData.supplier_code),
            createTableRow('SUPPLIER NAME', formData.supplier_name),
            createTableRow('FIRE STANDARD', formData.fire_standard),
            createTableRow("FOB 20' CONTAINER PRICE", formData.fob_20_container_price),
            createTableRow("FOB 40'HC CONTAINER PRICE", formData.fob_40_container_price),
            createTableRow('SHIPPING PORT', formData.shipping_port)
          ], 80),
          // 单位说明
          new Paragraph({
            children: [
              new TextRun({
                text: 'ALL MEASUREMENTS ARE TO BE IN MILLIMETRE\'S (MM) AND WEIGHTS IN KILOGRAMS (KG)',
                color: '000000',
                size: 16,
                bold: true,
                underline: {},
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },

          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'All Details to be completed fully',
                color: 'FF0000',
                size: 18,
                bold: true,
                underline: {},
              }),
              new TextRun({
                text: '',
                color: 'FF0000',
                size: 18,
                bold: true,
                underline: {},
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          // 所有其他表格合并在一个大表格中
          createTable([
            // UPHOLSTERY 部分
            createUpholsteryTableRow('FABRIC MANUFACTURER', 'N/A', true),
            createUpholsteryTableRow('COLOUR CODE', 'N/A'),
            createUpholsteryTableRow('LEATHER GRADE (WHERE APPLICABLE)', 'N/A'),
            createUpholsteryTableRow('USAGE PER CHAIR (BACK/SEAT)', 'Gray fabric:0.9m'),

            // CARTON 部分
            createCartonTableRow('WIDTH', '380MM', true),
            createCartonTableRow('DEPTH', '640MM'),
            createCartonTableRow('HEIGHT', '600MM'),
            createCartonTableRow('BOARD TYPE', '250lbs, 5 layers twin walled'),
            createCartonTableRow('Items per carton', '1pc'),
            createCartonTableRow('CARTON VOLUME (m³)', '0.146'),

            // PRODUCT 部分
            createMergedTableRow('PRODUCT', '', true, 2),
            createTableRow('PRODUCTION TIME (DAYS)', formData.logistics?.production_time),
            createTableRow('EFFECTIVE VOLUME (m³)', formData.logistics?.effective_volume),
            createTableRow('LOADING QUANTITY - 20\'GP', formData.logistics?.loading_quantity_20gp),
            createTableRow('LOADING QUANTITY - 40\'HC', formData.logistics?.loading_quantity_40hc),
            createTableRow('WEIGHT (KG) - NET', formData.logistics?.net_weight),
            createTableRow('WEIGHT (KG) - GROSS', formData.logistics?.gross_weight),

            // PRODUCT DIMENSIONS 部分
            createMergedTableRow('PRODUCT DIMENSIONS', '', true, 2),
            createTableRow('SEAT - WIDTH', formData.dimensions?.seat_width),
            createTableRow('SEAT - DEPTH', formData.dimensions?.seat_depth),
            createTableRow('BACK - WIDTH', formData.dimensions?.back_width),
            createTableRow('BACK - HEIGHT', formData.dimensions?.back_height),
            createTableRow('SEAT HEIGHT - MIN', formData.dimensions?.seat_height_min),
            createTableRow('SEAT HEIGHT - MAX', formData.dimensions?.seat_height_max),
            createTableRow('BACK HEIGHT - FROM SEAT', formData.dimensions?.back_height_from_seat),
            createTableRow('OVERALL - WIDTH', formData.dimensions?.overall_width),
            createTableRow('OVERALL - DEPTH', formData.dimensions?.overall_depth),
            createTableRow('OVERALL - HEIGHT', `${formData.dimensions?.overall_height_min}-${formData.dimensions?.overall_height_max}`),

            // 其他部分类似...
            // SEAT INNER STRUCTURE 部分
            createMergedTableRow('SEAT INNER STRUCTURE', '', true, 2),
            createTableRow('Material Code', formData.seat_inner?.material_code),
            createTableRow('Thickness', formData.seat_inner?.thickness),
            createTableRow('Layers Count', formData.seat_inner?.layers_count),
            createTableRow('Dimensions', formData.seat_inner?.dimensions),

            // BACK INNER STRUCTURE 部分
            createMergedTableRow('BACK INNER STRUCTURE', '', true, 2),
            createTableRow('Material Code', formData.back_inner?.material_code),
            createTableRow('Thickness', formData.back_inner?.thickness),
            createTableRow('Layers Count', formData.back_inner?.layers_count),
            createTableRow('Dimensions', formData.back_inner?.dimensions),

            // BACK OUTER STRUCTURE 部分
            createMergedTableRow('BACK OUTER STRUCTURE', '', true, 2),
            createTableRow('Material', formData.back_outer?.material),
            createTableRow('Dimensions', formData.back_outer?.dimensions),
            createTableRow('Manufacturer Name', formData.back_outer?.manufacturer_name),

            // SEAT OUTER STRUCTURE 部分
            createMergedTableRow('SEAT OUTER STRUCTURE', '', true, 2),
            createTableRow('Material', formData.seat_outer?.material),
            createTableRow('Dimensions', formData.seat_outer?.dimensions),
            createTableRow('Manufacturer Name', formData.seat_outer?.manufacturer_name),

            // ARMS 部分
            createMergedTableRow('ARMS', '', true, 2),
            createTableRow('Material', formData.arms?.material),
            createTableRow('Type', formData.arms?.type),
            createTableRow('Manufacturer', formData.arms?.manufacturer),
            createTableRow('Description', formData.arms?.description),
            createTableRow('Arm Height from Seat', formData.arms?.arm_height_from_seat),
            createTableRow('Arm Height from Floor', formData.arms?.arm_height_from_floor),

            // FOAM 部分
            createMergedTableRow('FOAM', '', true, 2),
            createTableRow('Description', formData.foam?.description),
            createTableRow('Seat Density', formData.foam?.seat_density),
            createTableRow('Back Density', formData.foam?.back_density),
            createTableRow('Seat Thickness', formData.foam?.seat_thickness),
            createTableRow('Back Thickness', formData.foam?.back_thickness),

            // CASTORS 部分
            createMergedTableRow('CASTORS', '', true, 2),
            createTableRow('Description', formData.castors?.description),
            createTableRow('Pin Thickness', formData.castors?.pin_thickness),
            createTableRow('Wheel Diameter', formData.castors?.wheel_diameter),

            // BASE 部分
            createMergedTableRow('BASE', '', true, 2),
            createTableRow('Description', formData.base?.description),
            createTableRow('Size Diameter', formData.base?.size_diameter),
            createTableRow('Material', formData.base?.material),
            createTableRow('Type', formData.base?.type),

            // GAS LIFT 部分
            createMergedTableRow('GAS LIFT', '', true, 2),
            createTableRow('Description', formData.gas_lift?.description),
            createTableRow('Gas Lift Class', formData.gas_lift?.gas_lift_class),
            createTableRow('Casing Length', formData.gas_lift?.casing_length),
            createTableRow('Extension Size', formData.gas_lift?.extension_size),
            createTableRow('Taper', formData.gas_lift?.taper),

            // GAS LIFT COVER 部分
            createMergedTableRow('GAS LIFT COVER', '', true, 2),
            createTableRow('Description', formData.gas_lift_cover?.description),
            createTableRow('Material', formData.gas_lift_cover?.material),
            createTableRow('Colour', formData.gas_lift_cover?.colour),

            // MECHANISM 部分
            createMergedTableRow('MECHANISM', '', true, 2),
            createTableRow('Description', formData.mechanism?.description),
            createTableRow('Levers Count', formData.mechanism?.levers_count),
            createTableRow('Locking Positions', formData.mechanism?.locking_positions),
            createTableRow('Model No', formData.mechanism?.model_no),
            createTableRow('Supplier Name', formData.mechanism?.supplier_name),

            // FITTINGS 部分
            createMergedTableRow('FITTINGS', '', true, 2),
            createTableRow('Fitting Number', formData.fittings?.fitting_number),
            createTableRow('Description', formData.fittings?.description),
            createTableRow('Quantity', formData.fittings?.quantity),
            createTableRow('Material', formData.fittings?.material)
          ], 100),
        ],
      }],
    })

    // 生成文档
    const buffer = await Packer.toBlob(doc)
    saveAs(buffer, 'product_specification.docx')
    return true
  } catch (error) {
    console.error('导出失败:', error)
    throw error
  }
}
