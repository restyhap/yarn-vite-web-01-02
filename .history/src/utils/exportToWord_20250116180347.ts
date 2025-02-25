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
    height: {
      value: 400,  // 设置行高
      rule: 'atLeast'  // 至少这么高
    },
    children: [
      new TableCell({
        width: {
          size: 30,
          type: 'pct',
        },
        children: [new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [new TextRun({
            text: label,
            font: 'Calibri',
            size: 16
          })]
        })],
        shading: hasShading ? { fill: 'F0F0F0' } : undefined,
        verticalAlign: 'center'  // 垂直居中
      }),
      new TableCell({
        width: {
          size: 70,
          type: 'pct',
        },
        children: [new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [new TextRun({
            text: value || '',
            font: 'Calibri',
            size: 16
          })]
        })],
        verticalAlign: 'center'  // 垂直居中
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
      size: tableWidth,
      type: 'pct',
    },
    alignment: AlignmentType.CENTER,
    borders: {  // 添加表格边框
      top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '000000' }
    },
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
 * @param isHeader - 是否是第一行
 * @returns TableRow - 返回一个表格行对象
 */
const createCartonTableRow = (label: string, value: string | undefined, isHeader = false) => {
  if (isHeader) {
    return new TableRow({
      children: [
        new TableCell({
          rowSpan: 6,
          width: {
            size: 25,
            type: 'pct',
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({
                text: 'CARTON (MINIMUM TWIN WALLED CARDBOARD WITH DIVIDERS)',
                font: 'Calibri',
                size: 20
              })]
            })
          ],
          verticalAlign: 'center'
        }),
        new TableCell({
          rowSpan: 6,
          width: {
            size: 25,
            type: 'pct',
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({
                text: 'DIMENSIONS',
                font: 'Calibri',
                size: 20
              })]
            })
          ],
          verticalAlign: 'center'
        }),
        new TableCell({
          width: {
            size: 25,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: label,
              font: 'Calibri',
              size: 20
            })]
          })]
        }),
        new TableCell({
          width: {
            size: 25,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: value || '',
              font: 'Calibri',
              size: 20
            })]
          })]
        })
      ]
    })
  } else {
    return new TableRow({
      children: [
        new TableCell({
          width: {
            size: 25,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: label,
              font: 'Calibri',
              size: 20
            })]
          })]
        }),
        new TableCell({
          width: {
            size: 25,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: value || '',
              font: 'Calibri',
              size: 20
            })]
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
              alignment: AlignmentType.CENTER,
              children: [new TextRun({
                text: 'UPHOLSTERY',
                font: 'Calibri',
                size: 20
              })]
            })
          ],
          verticalAlign: 'center'
        }),
        new TableCell({
          columnSpan: 2,
          width: {
            size: 50,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: label,
              font: 'Calibri',
              size: 20
            })]
          })]
        }),
        new TableCell({
          width: {
            size: 25,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: value || '',
              font: 'Calibri',
              size: 20
            })]
          })]
        })
      ]
    })
  } else {
    return new TableRow({
      children: [
        new TableCell({
          columnSpan: 2,
          width: {
            size: 50,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: label,
              font: 'Calibri',
              size: 20
            })]
          })]
        }),
        new TableCell({
          width: {
            size: 25,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: value || '',
              font: 'Calibri',
              size: 20
            })]
          })]
        })
      ]
    })
  }
}

/**
 * 创建 PRODUCT 表格的特殊行
 * @param label - 标签文本
 * @param value - 值文本
 * @param subLabel - 子标签文本
 * @param isHeader - 是否是标题行
 * @param isMergedLabel - 是否是合并的标签行（LOADING QUANTITY 或 WEIGHT）
 * @returns TableRow - 返回一个表格行对象
 */
const createProductTableRow = (label: string, value: string | undefined, subLabel?: string, isHeader = false, isMergedLabel = false) => {
  if (isHeader) {
    // 第一行，包含所有列
    return new TableRow({
      children: [
        new TableCell({
          rowSpan: 6,
          width: {
            size: 25,
            type: 'pct',
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({
                text: 'PRODUCT',
                font: 'Calibri',
                size: 20
              })]
            })
          ],
          verticalAlign: 'center'
        }),
        new TableCell({
          columnSpan: 2,
          width: {
            size: 50,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: label,
              font: 'Calibri',
              size: 20
            })]
          })]
        }),
        new TableCell({
          width: {
            size: 25,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: value || '',
              font: 'Calibri',
              size: 20
            })]
          })]
        })
      ]
    })
  } else if (isMergedLabel) {
    // LOADING QUANTITY 或 WEIGHT 的标签行
    return new TableRow({
      children: [
        new TableCell({
          rowSpan: 2,
          width: {
            size: 25,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: label,
              font: 'Calibri',
              size: 20
            })]
          })]
        }),
        new TableCell({
          width: {
            size: 25,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: subLabel || '',
              font: 'Calibri',
              size: 20
            })]
          })]
        }),
        new TableCell({
          width: {
            size: 25,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: value || '',
              font: 'Calibri',
              size: 20
            })]
          })]
        })
      ]
    })
  } else if (!isMergedLabel && subLabel) {
    // LOADING QUANTITY 或 WEIGHT 的第二行
    return new TableRow({
      children: [
        new TableCell({
          width: {
            size: 25,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: subLabel || '',
              font: 'Calibri',
              size: 20
            })]
          })]
        }),
        new TableCell({
          width: {
            size: 25,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: value || '',
              font: 'Calibri',
              size: 20
            })]
          })]
        })
      ]
    })
  } else {
    // 普通行（EFFECTIVE VOLUME）
    return new TableRow({
      children: [
        new TableCell({
          columnSpan: 2,
          width: {
            size: 50,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: label,
              font: 'Calibri',
              size: 20
            })]
          })]
        }),
        new TableCell({
          width: {
            size: 25,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: value || '',
              font: 'Calibri',
              size: 20
            })]
          })]
        })
      ]
    })
  }
}

/**
 * 创建 PRODUCT DIMENSIONS 表格的特殊行
 * @param label - 标签文本
 * @param value - 值文本
 * @param subLabel - 子标签文本
 * @param isHeader - 是否是标题行
 * @param rowConfig - 行配置对象，包含 rowSpan 和 secondColumnText
 * @returns TableRow - 返回一个表格行对象
 */
const createProductDimensionsTableRow = (
  label: string, 
  value: string | undefined, 
  subLabel?: string, 
  isHeader = false,
  rowConfig?: { rowSpan?: number; secondColumnText?: string; isSecondColumnStart?: boolean }
) => {
  if (isHeader) {
    return new TableRow({
      children: [
        new TableCell({
          rowSpan: 10,
          width: {
            size: 25,
            type: 'pct',
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({
                text: 'PRODUCT DIMENSIONS',
                font: 'Calibri',
                size: 20
              })]
            })
          ],
          verticalAlign: 'center'
        }),
        new TableCell({
          rowSpan: 2,
          width: {
            size: 25,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: 'SEAT',
              font: 'Calibri',
              size: 20
            })]
          })]
        }),
        new TableCell({
          width: {
            size: 25,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: 'WIDTH',
              font: 'Calibri',
              size: 20
            })]
          })]
        }),
        new TableCell({
          width: {
            size: 25,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: value || '',
              font: 'Calibri',
              size: 20
            })]
          })]
        })
      ]
    })
  } else if (rowConfig?.isSecondColumnStart) {
    // 第二列开始的合并行
    return new TableRow({
      children: [
        new TableCell({
          rowSpan: rowConfig.rowSpan || 1,
          width: {
            size: 25,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: rowConfig.secondColumnText || '',
              font: 'Calibri',
              size: 20
            })]
          })]
        }),
        new TableCell({
          width: {
            size: 25,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: label,
              font: 'Calibri',
              size: 20
            })]
          })]
        }),
        new TableCell({
          width: {
            size: 25,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: value || '',
              font: 'Calibri',
              size: 20
            })]
          })]
        })
      ]
    })
  } else {
    // 普通行
    return new TableRow({
      children: [
        new TableCell({
          width: {
            size: 25,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: label,
              font: 'Calibri',
              size: 20
            })]
          })]
        }),
        new TableCell({
          width: {
            size: 25,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: value || '',
              font: 'Calibri',
              size: 20
            })]
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
        properties: {
          page: {
            margin: {
              top: 600,
              right: 600,
              bottom: 600,
              left: 600,
            },
          },
        },
        children: [
          // 标题
          new Paragraph({
            children: [
              new TextRun({
                text: 'FULL PRODUCT SPECIFICATION SHEET（包装信息表）',
                color: 'FF0000',
                size: 28,
                bold: true,
                underline: {},
                font: 'Arial'
              })
            ],
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          // 基本信息表 - 恢复原来的宽度和样式
          createTable([
            createTableRow('TCCODE', formData.tccode),
            createTableRow('SUPPLIER', formData.supplier),
            createTableRow('SUPPLIER CODE', formData.supplier_code),
            createTableRow('SUPPLIER NAME', formData.supplier_name),
            createTableRow('FIRE STANDARD', formData.fire_standard),
            createTableRow("FOB 20' CONTAINER PRICE", formData.fob_20_container_price),
            createTableRow("FOB 40'HC CONTAINER PRICE", formData.fob_40_container_price),
            createTableRow('SHIPPING PORT', formData.shipping_port)
          ], 60),  // 恢复原来的宽度
          // 单位说明
          new Paragraph({
            children: [
              new TextRun({
                text: 'ALL MEASUREMENTS ARE TO BE IN MILLIMETRE\'S (MM) AND WEIGHTS IN KILOGRAMS (KG)',
                color: '000000',
                size: 20,  // 增加字号
                bold: true,
                underline: {},
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 120 },  // 增加间距
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'All Details to be completed fully',
                color: 'FF0000',
                size: 20,  // 增加字号
                bold: true,
                underline: {},
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 }  // 增加间距
          }),

          // 第一个大表格：包含所有表格
          createTable([
            // UPHOLSTERY 部分
            createUpholsteryTableRow('FABRIC MANUFACTURER', formData.upholstery?.fabric_manufacturer || 'N/A', true),
            createUpholsteryTableRow('COLOUR CODE', formData.upholstery?.colour_code || 'N/A'),
            createUpholsteryTableRow('LEATHER GRADE (WHERE APPLICABLE)', formData.upholstery?.leather_grade || 'N/A'),
            createUpholsteryTableRow('USAGE PER CHAIR (BACK/SEAT)', formData.upholstery?.usage_per_chair || 'N/A'),

            // CARTON 部分
            createCartonTableRow('WIDTH', (formData.packaging?.carton_width ? formData.packaging.carton_width + 'MM' : 'N/A'), true),
            createCartonTableRow('DEPTH', (formData.packaging?.carton_length ? formData.packaging.carton_length + 'MM' : 'N/A')),
            createCartonTableRow('HEIGHT', (formData.packaging?.carton_height ? formData.packaging.carton_height + 'MM' : 'N/A')),
            createCartonTableRow('BOARD TYPE', formData.packaging?.board_type || 'N/A'),
            createCartonTableRow('Items per carton', (formData.packaging?.items_per_carton ? formData.packaging.items_per_carton + 'pc' : 'N/A')),
            createCartonTableRow('CARTON VOLUME (m³)', formData.packaging?.carton_volume || 'N/A'),

            // PRODUCT 部分
            createProductTableRow('PRODUCTION TIME (DAYS)', (formData.logistics?.production_time ? formData.logistics.production_time + 'Day' : 'N/A'), undefined, true),
            createProductTableRow('EFFECTIVE VOLUME (m³)', formData.logistics?.effective_volume || 'N/A'),
            createProductTableRow('LOADING QUANTITY', formData.logistics?.loading_quantity_20gp || 'N/A', '20\'GP', false, true),
            createProductTableRow('', formData.logistics?.loading_quantity_40hc || 'N/A', '40\'HC'),
            createProductTableRow('WEIGHT (KG)', (formData.logistics?.net_weight ? formData.logistics.net_weight + 'KG' : 'N/A'), 'NET', false, true),
            createProductTableRow('', (formData.logistics?.gross_weight ? formData.logistics.gross_weight + 'KG' : 'N/A'), 'GROSS'),

            // PRODUCT DIMENSIONS 部分
            createProductDimensionsTableRow('WIDTH', (formData.dimensions?.seat_width ? formData.dimensions.seat_width + 'MM' : 'N/A'), 'SEAT', true),
            createProductDimensionsTableRow('DEPTH', (formData.dimensions?.seat_depth ? formData.dimensions.seat_depth + 'MM' : 'N/A')),
            createProductDimensionsTableRow('WIDTH', (formData.dimensions?.back_width ? formData.dimensions.back_width + 'MM' : 'N/A'), 'BACK', false, { isSecondColumnStart: true, rowSpan: 2, secondColumnText: 'BACK' }),
            createProductDimensionsTableRow('HEIGHT', (formData.dimensions?.back_height ? formData.dimensions.back_height + 'MM' : 'N/A')),
            createProductDimensionsTableRow('MIN', (formData.dimensions?.seat_height_min ? formData.dimensions.seat_height_min + 'MM' : 'N/A'), 'SEAT HEIGHT', false, { isSecondColumnStart: true, rowSpan: 2, secondColumnText: 'SEAT HEIGHT' }),
            createProductDimensionsTableRow('MAX', (formData.dimensions?.seat_height_max ? formData.dimensions.seat_height_max + 'MM' : 'N/A')),
            createProductDimensionsTableRow('FROM SEAT', (formData.dimensions?.back_height_from_seat ? formData.dimensions.back_height_from_seat + 'MM' : 'N/A'), 'SEAT HEIGHT', false, { isSecondColumnStart: true, rowSpan: 1, secondColumnText: 'SEAT HEIGHT' }),
            createProductDimensionsTableRow('WIDTH', (formData.dimensions?.overall_width ? formData.dimensions.overall_width + 'MM' : 'N/A'), 'OVERALL', false, { isSecondColumnStart: true, rowSpan: 3, secondColumnText: 'OVERALL' }),
            createProductDimensionsTableRow('DEPTH', (formData.dimensions?.overall_depth ? formData.dimensions.overall_depth + 'MM' : 'N/A')),
            createProductDimensionsTableRow('HEIGHT', (formData.dimensions?.overall_height_min ? formData.dimensions.overall_height_min + 'MM' : 'N/A')),
          ], 95),
        ],
      }],
      styles: {
        paragraphStyles: [
          {
            id: 'Normal',
            name: 'Normal',
            quickFormat: true,
            run: {
              size: 20,
              font: 'Calibri'
            },
            paragraph: {
              spacing: { 
                before: 0,
                after: 0,
                line: 360
              }
            }
          }
        ]
      }
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
