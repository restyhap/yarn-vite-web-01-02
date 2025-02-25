import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, AlignmentType, HeadingLevel, BorderStyle, VerticalAlign } from 'docx'
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
      value: 400,
      rule: 'atLeast'
    },
    children: [
      new TableCell({
        width: {
          size: 50,
          type: 'pct',
        },
        children: [new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 80, after: 80 },
          children: [new TextRun({
            text: label,
            font: 'Calibri',
            size: 16,
            bold: true
          })]
        })],
        verticalAlign: VerticalAlign.CENTER
      }),
      new TableCell({
        width: {
          size: 50,
          type: 'pct',
        },
        children: [new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 80, after: 80 },
          children: [new TextRun({
            text: value || '',
            font: 'Calibri',
            size: 16,
            bold: true
          })]
        })],
        verticalAlign: VerticalAlign.CENTER
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
                size: 20,
                bold: true
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
                size: 20,
                bold: true
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
              size: 20,
              bold: true
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
              size: 20,
              bold: true
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
              size: 20,
              bold: true
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
              size: 20,
              bold: true
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
                size: 20,
                bold: true
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
              size: 20,
              bold: true
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
              size: 20,
              bold: true
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
              size: 20,
              bold: true
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
              size: 20,
              bold: true
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
                size: 20,
                bold: true
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
              size: 20,
              bold: true
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
              size: 20,
              bold: true
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
              size: 20,
              bold: true
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
              size: 20,
              bold: true
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
              size: 20,
              bold: true
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
              size: 20,
              bold: true
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
              size: 20,
              bold: true
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
              size: 20,
              bold: true
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
              size: 20,
              bold: true
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
                size: 20,
                bold: true
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
              size: 20,
              bold: true
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
              size: 20,
              bold: true
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
              size: 20,
              bold: true
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
              size: 20,
              bold: true
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
              size: 20,
              bold: true
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
              size: 20,
              bold: true
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
              size: 20,
              bold: true
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
              size: 20,
              bold: true
            })]
          })]
        })
      ]
    })
  }
}

/**
 * 创建通用的三列布局表格行
 * @param title - 第一列标题
 * @param label - 第二列标签
 * @param value - 第三列值
 * @param isFirstRow - 是否是第一行（用于合并单元格）
 * @param rowSpan - 需要合并的行数
 * @returns TableRow - 返回一个表格行对象
 */
const createThreeColumnTableRow = (
  title: string,
  label: string,
  value: string | undefined,
  isFirstRow = false,
  rowSpan = 1
) => {
  const cells = []

  if (isFirstRow) {
    cells.push(
      new TableCell({
        rowSpan: rowSpan,
        width: {
          size: 25,
          type: 'pct',
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({
              text: title,
              font: 'Calibri',
              size: 20,
              bold: true
            })]
          })
        ],
        verticalAlign: VerticalAlign.CENTER
      })
    )
  }

  cells.push(
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
          size: 20,
          bold: true
        })]
      })]
    }),
    new TableCell({
      width: {
        size: 50,
        type: 'pct',
      },
      children: [new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [new TextRun({
          text: value || '',
          font: 'Calibri',
          size: 20,
          bold: true
        })]
      })]
    })
  )

  return new TableRow({
    children: cells
  })
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
                size: 20,
                bold: true,
                underline: {},
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'All Details to be completed fully',
                color: 'FF0000',
                size: 20,
                bold: true,
                underline: {},
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 }
          }),

          // 成表（包含 UPHOLSTERY、CARTON、PRODUCT 和 PRODUCT DIMENSIONS）
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

          // 添加分页符
          new Paragraph({
            children: [],
            pageBreakBefore: true
          }),

          // 其他表格（每个表格独立显示）
          // SEAT INNER 表格
          createTable([
            createThreeColumnTableRow('SEAT INNER', 'Material Code', formData.seat_inner?.material_code || 'N/A', true, 4),
            createThreeColumnTableRow('', 'Thickness', formData.seat_inner?.thickness || 'N/A'),
            createThreeColumnTableRow('', 'Layers Count', formData.seat_inner?.layers_count || 'N/A'),
            createThreeColumnTableRow('', 'Dimensions', formData.seat_inner?.dimensions || 'N/A')
          ], 80),

          // BACK INNER 表格
          createTable([
            createThreeColumnTableRow('BACK INNER', 'Material Code', formData.back_inner?.material_code || 'N/A', true, 4),
            createThreeColumnTableRow('', 'Thickness', formData.back_inner?.thickness || 'N/A'),
            createThreeColumnTableRow('', 'Layers Count', formData.back_inner?.layers_count || 'N/A'),
            createThreeColumnTableRow('', 'Dimensions', formData.back_inner?.dimensions || 'N/A')
          ], 80),

          // BACK OUTER 表格
          createTable([
            createThreeColumnTableRow('BACK OUTER', 'Material', formData.back_outer?.material || 'N/A', true, 3),
            createThreeColumnTableRow('', 'Dimensions', formData.back_outer?.dimensions || 'N/A'),
            createThreeColumnTableRow('', 'Manufacturer Name', formData.back_outer?.manufacturer_name || 'N/A')
          ], 80),

          // SEAT OUTER 表格
          createTable([
            createThreeColumnTableRow('SEAT OUTER', 'Material', formData.seat_outer?.material || 'N/A', true, 3),
            createThreeColumnTableRow('', 'Dimensions', formData.seat_outer?.dimensions || 'N/A'),
            createThreeColumnTableRow('', 'Manufacturer Name', formData.seat_outer?.manufacturer_name || 'N/A')
          ], 80),

          // ARMS 表格
          createTable([
            createThreeColumnTableRow('ARMS', 'Material', formData.arms?.material || 'N/A', true, 6),
            createThreeColumnTableRow('', 'Type', formData.arms?.type || 'N/A'),
            createThreeColumnTableRow('', 'Manufacturer', formData.arms?.manufacturer || 'N/A'),
            createThreeColumnTableRow('', 'Description', formData.arms?.description || 'N/A'),
            createThreeColumnTableRow('', 'Arm Height from Seat', formData.arms?.arm_height_from_seat || 'N/A'),
            createThreeColumnTableRow('', 'Arm Height from Floor', formData.arms?.arm_height_from_floor || 'N/A')
          ], 80),

          // FOAM 表格
          createTable([
            createThreeColumnTableRow('FOAM', 'Description', formData.foam?.description || 'N/A', true, 2),
            createThreeColumnTableRow('', 'Seat Density', formData.foam?.seat_density || 'N/A'),
            createThreeColumnTableRow('', 'Back Density', formData.foam?.back_density || 'N/A'),
            createThreeColumnTableRow('', 'Seat Thickness', formData.foam?.seat_thickness || 'N/A'),
            createThreeColumnTableRow('', 'Back Thickness', formData.foam?.back_thickness || 'N/A')
          ], 80),

          // CASTORS 表格
          createTable([
            createThreeColumnTableRow('CASTORS', 'Description', formData.castors?.description || 'N/A', true, 2),
            createThreeColumnTableRow('', 'Pin Thickness', formData.castors?.pin_thickness || 'N/A'),
            createThreeColumnTableRow('', 'Wheel Diameter', formData.castors?.wheel_diameter || 'N/A')
          ], 80),

          // BASE 表格
          createTable([
            createThreeColumnTableRow('BASE', 'Description', formData.base?.description || 'N/A', true, 2),
            createThreeColumnTableRow('', 'Size Diameter', formData.base?.size_diameter || 'N/A'),
            createThreeColumnTableRow('', 'Material', formData.base?.material || 'N/A'),
            createThreeColumnTableRow('', 'Type', formData.base?.type || 'N/A')
          ], 80),

          // GAS LIFT 表格
          createTable([
            createThreeColumnTableRow('GAS LIFT', 'Description', formData.gas_lift?.description || 'N/A', true, 2),
            createThreeColumnTableRow('', 'Gas Lift Class', formData.gas_lift?.gas_lift_class || 'N/A'),
            createThreeColumnTableRow('', 'Casing Length', formData.gas_lift?.casing_length || 'N/A'),
            createThreeColumnTableRow('', 'Extension Size', formData.gas_lift?.extension_size || 'N/A'),
            createThreeColumnTableRow('', 'Taper', formData.gas_lift?.taper || 'N/A')
          ], 80),

          // GAS LIFT COVER 表格
          createTable([
            createThreeColumnTableRow('GAS LIFT COVER', 'Description', formData.gas_lift_cover?.description || 'N/A', true, 2),
            createThreeColumnTableRow('', 'Material', formData.gas_lift_cover?.material || 'N/A'),
            createThreeColumnTableRow('', 'Colour', formData.gas_lift_cover?.colour || 'N/A')
          ], 80),

          // MECHANISM 表格
          createTable([
            createThreeColumnTableRow('MECHANISM', 'Description', formData.mechanism?.description || 'N/A', true, 2),
            createThreeColumnTableRow('', 'Levers Count', formData.mechanism?.levers_count || 'N/A'),
            createThreeColumnTableRow('', 'Locking Positions', formData.mechanism?.locking_positions || 'N/A'),
            createThreeColumnTableRow('', 'Model No', formData.mechanism?.model_no || 'N/A'),
            createThreeColumnTableRow('', 'Supplier Name', formData.mechanism?.supplier_name || 'N/A')
          ], 80),

          // FITTINGS 表格
          createTable([
            createThreeColumnTableRow('FITTINGS', 'Fitting Number', formData.fittings?.fitting_number || 'N/A', true, 2),
            createThreeColumnTableRow('', 'Description', formData.fittings?.description || 'N/A'),
            createThreeColumnTableRow('', 'Quantity', formData.fittings?.quantity || 'N/A'),
            createThreeColumnTableRow('', 'Material', formData.fittings?.material || 'N/A')
          ], 80),
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
              font: 'Calibri',
              bold: true
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
