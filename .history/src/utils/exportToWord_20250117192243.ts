import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, AlignmentType, HeadingLevel, BorderStyle, VerticalAlign, WidthType, ImageRun } from 'docx'
import { saveAs } from 'file-saver'

/**
 * 表单数据接口定义
 * 使用索引签名允许任意字符串键
 */
interface FormData {
  [key: string]: any
}

// 表格总宽度
const TOTAL_WIDTH = 9026

// 两列表格的宽度配置
const TWO_COLUMN_WIDTHS = {
  LABEL: 3026,
  CONTENT: 6000
}

// 三列表格的宽度配置
const THREE_COLUMN_WIDTHS = {
  FIRST: 2000,
  SECOND: 2000,
  THIRD: 5026
}

// 四列表格的宽度配置
const FOUR_COLUMN_WIDTHS = {
  FIRST: 2256,   // 25%
  SECOND: 3159,  // 35%
  THIRD: 1805,   // 20%
  FOURTH: 1806   // 20%
}

// 合并列的宽度配置
const MERGED_COLUMN_WIDTHS = {
  // 2,3列合并 (25% 55% 20%)
  MIDDLE_MERGED: {
    FIRST: 2256,   // 25%
    SECOND: 4964,  // 55%
    THIRD: 1806    // 20%
  },
  // 3,4列合并 (25% 35% 40%)
  LAST_MERGED: {
    FIRST: 2256,   // 25%
    SECOND: 3159,  // 35%
    THIRD: 3611    // 40%
  }
}

/**
 * 统一表格宽度配置
 */
const TABLE_WIDTH = {
  size: TOTAL_WIDTH,
  type: WidthType.DXA
}

/**
 * 统一单元格宽度配置
 */
const CELL_WIDTHS = {
  // 三列表格的宽度配置
  three_columns: {
    first: {
      size: THREE_COLUMN_WIDTHS.FIRST,
      type: WidthType.DXA
    },
    second: {
      size: THREE_COLUMN_WIDTHS.SECOND,
      type: WidthType.DXA
    },
    third: {
      size: THREE_COLUMN_WIDTHS.THIRD,
      type: WidthType.DXA
    }
  },
  // 两列表格的宽度配置
  two_columns: {
    label: {
      size: TWO_COLUMN_WIDTHS.LABEL,
      type: WidthType.DXA
    },
    content: {
      size: TWO_COLUMN_WIDTHS.CONTENT,
      type: WidthType.DXA
    }
  }
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
          size: TWO_COLUMN_WIDTHS.LABEL,
          type: WidthType.DXA,
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
          size: TWO_COLUMN_WIDTHS.CONTENT,
          type: WidthType.DXA,
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
            size: FOUR_COLUMN_WIDTHS.FIRST,
            type: WidthType.DXA
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
            size: FOUR_COLUMN_WIDTHS.SECOND,
            type: WidthType.DXA
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
            size: FOUR_COLUMN_WIDTHS.THIRD,
            type: WidthType.DXA
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
            size: FOUR_COLUMN_WIDTHS.FOURTH,
            type: WidthType.DXA
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
            size: FOUR_COLUMN_WIDTHS.THIRD,
            type: WidthType.DXA
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
            size: FOUR_COLUMN_WIDTHS.FOURTH,
            type: WidthType.DXA
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
            size: 55,
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
            size: 20,
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
            size: 55,
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
            size: 20,
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
            size: 55,
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
            size: 20,
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
    return new TableRow({
      children: [
        new TableCell({
          rowSpan: 2,
          width: {
            size: 30,
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
            size: 20,
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
    return new TableRow({
      children: [
        new TableCell({
          width: {
            size: 30,
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
            size: 20,
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
            size: 55,
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
            size: 20,
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
 * 创建通用的四列布局表格行（第三、四列合并）
 * @param title - 第一列标题
 * @param label - 第二列标签
 * @param value - 第三列值（合并后的值）
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
            spacing: { before: 80, after: 80 },
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
        size: 35,
        type: 'pct',
      },
      children: [new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 80, after: 80 },
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
        size: 40,
        type: 'pct',
      },
      columnSpan: 2,  // 合并第三和第四列
      children: [new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 80, after: 80 },
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
    height: {
      value: 400,
      rule: 'atLeast'
    },
    children: cells
  })
}

/**
 * 创建 FOAM 表格的特殊行
 */
const createFoamTableRow = (formData: any, rowType: 'header' | 'density' | 'thickness') => {
  if (rowType === 'header') {
    return new TableRow({
      children: [
        new TableCell({
          rowSpan: 5,
          width: {
            size: 25,
            type: 'pct',
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({
                text: 'FOAM',
                font: 'Calibri',
                size: 20,
                bold: true
              })]
            })
          ],
          verticalAlign: VerticalAlign.CENTER
        }),
        new TableCell({
          width: {
            size: 35,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: 'Description',
              font: 'Calibri',
              size: 20,
              bold: true
            })]
          })]
        }),
        new TableCell({
          columnSpan: 2,
          width: {
            size: 40,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({
              text: formData.foam?.description || 'N/A',
              font: 'Calibri',
              size: 20,
              bold: true
            })]
          })]
        })
      ]
    })
  } else if (rowType === 'density') {
    return [
      new TableRow({
        children: [
          new TableCell({
            rowSpan: 2,
            width: {
              size: 35,
              type: 'pct',
            },
            children: [new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [new TextRun({
                text: 'DENSITY (kg/m³)',
                font: 'Calibri',
                size: 20,
                bold: true
              })]
            })]
          }),
          new TableCell({
            width: {
              size: 20,
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
              size: 20,
              type: 'pct',
            },
            children: [new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [new TextRun({
                text: formData.foam?.seat_density || 'N/A',
                font: 'Calibri',
                size: 20,
                bold: true
              })]
            })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: {
              size: 20,
              type: 'pct',
            },
            children: [new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [new TextRun({
                text: 'BACK',
                font: 'Calibri',
                size: 20,
                bold: true
              })]
            })]
          }),
          new TableCell({
            width: {
              size: 20,
              type: 'pct',
            },
            children: [new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [new TextRun({
                text: formData.foam?.back_density || 'N/A',
                font: 'Calibri',
                size: 20,
                bold: true
              })]
            })]
          })
        ]
      })
    ]
  } else {
    return [
      new TableRow({
        children: [
          new TableCell({
            rowSpan: 2,
            width: {
              size: 35,
              type: 'pct',
            },
            children: [new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [new TextRun({
                text: 'OVERALL, MIN –MAX THICKNESS',
                font: 'Calibri',
                size: 20,
                bold: true
              })]
            })]
          }),
          new TableCell({
            width: {
              size: 20,
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
              size: 20,
              type: 'pct',
            },
            children: [new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [new TextRun({
                text: formData.foam?.seat_thickness || 'N/A',
                font: 'Calibri',
                size: 20,
                bold: true
              })]
            })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: {
              size: 20,
              type: 'pct',
            },
            children: [new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [new TextRun({
                text: 'BACK',
                font: 'Calibri',
                size: 20,
                bold: true
              })]
            })]
          }),
          new TableCell({
            width: {
              size: 20,
              type: 'pct',
            },
            children: [new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [new TextRun({
                text: formData.foam?.back_thickness || 'N/A',
                font: 'Calibri',
                size: 20,
                bold: true
              })]
            })]
          })
        ]
      })
    ]
  }
}

/**
 * 将图片URL转换为base64字符串
 */
const getImageAsBase64 = async (imageUrl: string): Promise<string> => {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Failed to convert image to base64:', error)
    throw error
  }
}

/**
 * 创建图片表格行
 */
const createImageTableRow = async (title: string, imageUrl: string | undefined, isFirstRow = false) => {
  // 如果没有图片URL,返回一个空的单元格
  if (!imageUrl) {
    return new TableRow({
      children: [
        new TableCell({
          width: {
            size: 100,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({
              text: 'No Image Available',
              font: 'Calibri',
              size: 20,
              bold: true
            })]
          })]
        })
      ]
    })
  }

  try {
    const base64Image = await getImageAsBase64(imageUrl)
    const imageData = base64Image.split(',')[1]
    const imageBuffer = Buffer.from(imageData, 'base64')

    return new TableRow({
      children: [
        new TableCell({
          width: {
            size: 100,
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
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new ImageRun({
                  data: imageBuffer,
                  transformation: {
                    width: 400,
                    height: 300
                  },
                  type: 'png'
                })
              ]
            })
          ]
        })
      ]
    })
  } catch (error) {
    console.error('Failed to load image:', error)
    return new TableRow({
      children: [
        new TableCell({
          width: {
            size: 100,
            type: 'pct',
          },
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({
              text: 'Failed to load image',
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
            createTableRow('PRODUCT CODE', formData.product_code || 'N/A'),
            createTableRow('PRODUCT NAME', formData.product_name || 'N/A'),
            createTableRow('PRODUCT DESCRIPTION', formData.product_description || 'N/A'),
            createTableRow('PRODUCT CATEGORY', formData.product_category || 'N/A'),
            createTableRow('PRODUCT SUBCATEGORY', formData.product_subcategory || 'N/A'),
            createTableRow('PRODUCT BRAND', formData.product_brand || 'N/A'),
          ], 60),

          // 单位说明
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({
                text: 'ALL MEASUREMENTS ARE TO BE IN MILLIMETRE\'S (MM) AND WEIGHTS IN KILOGRAMS (KG)',
                font: 'Calibri',
                size: 20,
                bold: true,
                underline: {}
              })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'All Details to be completed fully',
                font: 'Calibri',
                color: 'FF0000',
                size: 20,
                bold: true,
                underline: {},
              })
            ]
          }),

          // 成表（包含 UPHOLSTERY、CARTON、PRODUCT、PRODUCT DIMENSIONS）
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
            createProductDimensionsTableRow('HEIGHT', (formData.dimensions?.overall_height_min ? formData.dimensions.overall_height_min + 'MM' : 'N/A'))
          ].flat(), 90),

          // 添加分页符，开始第二页
          new Paragraph({
            children: [],
            pageBreakBefore: true
          }),

          // 第二页的表格
          // SEAT INNER 表格
          createTable([
            createThreeColumnTableRow('SEAT INNER', 'MATERIAL & MANUFACTURER CODE', formData.seat_inner?.material_code || 'N/A', true, 4),
            createThreeColumnTableRow('', 'OVERALL THICKNESS', formData.seat_inner?.thickness || 'N/A'),
            createThreeColumnTableRow('', 'NUMBER OF LAYERS木板层数', formData.seat_inner?.layers_count || 'N/A'),
            createThreeColumnTableRow('', 'DIMENSIONS木板尺寸', formData.seat_inner?.dimensions || 'N/A')
          ], 90),

          // BACK INNER 表格
          createTable([
            createThreeColumnTableRow('BACK INNER', 'MATERIAL & MANUFACTURER CODE', formData.back_inner?.material_code || 'N/A', true, 4),
            createThreeColumnTableRow('', 'NUMBER OF LAYERS木板层数', formData.back_inner?.layers_count || 'N/A'),
            createThreeColumnTableRow('', 'OVERALL THICKNESS', formData.back_inner?.thickness || 'N/A'),
            createThreeColumnTableRow('', 'DIMENSIONS木板尺寸', formData.back_inner?.dimensions || 'N/A')
          ], 90),

          // SEAT OUTER 表格
          createTable([
            createThreeColumnTableRow('SEAT OUTER', 'Material', formData.seat_outer?.material || 'N/A', true, 3),
            createThreeColumnTableRow('', 'Dimensions', formData.seat_outer?.dimensions || 'N/A'),
            createThreeColumnTableRow('', 'Manufacturer Name', formData.seat_outer?.manufacturer_name || 'N/A')
          ], 90),

          // BACK OUTER 表格
          createTable([
            createThreeColumnTableRow('BACK OUTER', 'Material', formData.back_outer?.material || 'N/A', true, 3),
            createThreeColumnTableRow('', 'Dimensions', formData.back_outer?.dimensions || 'N/A'),
            createThreeColumnTableRow('', 'Manufacturer Name', formData.back_outer?.manufacturer_name || 'N/A')
          ], 90),

          // ARMS 表格
          createTable([
            createThreeColumnTableRow('ARMS', 'DESCRIPTION', formData.arms?.description || 'N/A', true, 6),
            createThreeColumnTableRow('', 'MATERIAL', formData.arms?.material || 'N/A'),
            createThreeColumnTableRow('', 'TYPE', formData.arms?.type || 'N/A'),
            createThreeColumnTableRow('', 'MANUFACTURER', formData.arms?.manufacturer || 'N/A'),
            createThreeColumnTableRow('', 'ARM HEIGHT FROM SEAT', formData.arms?.arm_height_from_seat || 'N/A'),
            createThreeColumnTableRow('', 'ARM HEIGHT FROM FLOOR', formData.arms?.arm_height_from_floor || 'N/A')
          ], 90),

          // FOAM 表格
          createTable([
            createFoamTableRow(formData, 'header'),
            ...(createFoamTableRow(formData, 'density') as TableRow[]),
            ...(createFoamTableRow(formData, 'thickness') as TableRow[])
          ].flat(), 90),

          // 添加分页符，开始第三页
          new Paragraph({
            children: [],
            pageBreakBefore: true
          }),

          // 第三页开始的表格
          // CASTORS 表格
          createTable([
            createThreeColumnTableRow('CASTORS / FEET', 'DESCRIPTION', formData.castors?.description || 'N/A', true, 3),
            createThreeColumnTableRow('', 'PIN THICKNESS', formData.castors?.pin_thickness || 'N/A'),
            createThreeColumnTableRow('', 'SIZE/WHEEL DIAMETER (Ф)', formData.castors?.wheel_diameter || 'N/A')
          ], 90),

          // BASE 表格
          createTable([
            createThreeColumnTableRow('BASE', 'DESCRIPTION', formData.base?.description || 'N/A', true, 4),
            createThreeColumnTableRow('', 'SIZE (R)', formData.base?.size_diameter || 'N/A'),
            createThreeColumnTableRow('', 'MATERIAL', formData.base?.material || 'N/A'),
            createThreeColumnTableRow('', 'TYPE', formData.base?.type || 'N/A')
          ], 90),

          // GAS LIFT 表格
          createTable([
            createThreeColumnTableRow('GAS LIFT', 'DESCRIPTION', formData.gas_lift?.description || 'N/A', true, 5),
            createThreeColumnTableRow('', 'GAS LIFT CLASS (规格)', formData.gas_lift?.gas_lift_class || 'N/A'),
            createThreeColumnTableRow('', 'LENGTH OF CASING (气杆外管)', formData.gas_lift?.casing_length || 'N/A'),
            createThreeColumnTableRow('', 'SIZE OF EXTENSION（行程）', formData.gas_lift?.extension_size || 'N/A'),
            createThreeColumnTableRow('', 'TAPER (MM)', formData.gas_lift?.taper || 'N/A')
          ], 90),

          // GAS LIFT COVER 表格
          createTable([
            createThreeColumnTableRow('GAS LIFT COVER', 'DESCRIPTION', formData.gas_lift_cover?.description || 'N/A', true, 3),
            createThreeColumnTableRow('', 'MATERIAL', formData.gas_lift_cover?.material || 'N/A'),
            createThreeColumnTableRow('', 'COLOUR', formData.gas_lift_cover?.colour || 'N/A')
          ], 90),

          // MECHANISM 表格
          createTable([
            createThreeColumnTableRow('MECHANISM', 'DESCRIPTION', formData.mechanism?.description || 'N/A', true, 5),
            createThreeColumnTableRow('', 'LEVERS', formData.mechanism?.levers_count || 'N/A'),
            createThreeColumnTableRow('', 'LOCKING POSITIONS (锁定位置)', formData.mechanism?.locking_positions || 'N/A'),
            createThreeColumnTableRow('', 'MODEL №', formData.mechanism?.model_no || 'N/A'),
            createThreeColumnTableRow('', 'NAME OF MECH SUPPLIER', formData.mechanism?.supplier_name || 'N/A')
          ], 90),

          // FITTINGS 表格
          createTable([
            createThreeColumnTableRow('FITTINGS', 'Fitting Number', formData.fittings?.fitting_number || 'N/A', true, 4),
            createThreeColumnTableRow('', 'Description', formData.fittings?.description || 'N/A'),
            createThreeColumnTableRow('', 'Quantity', formData.fittings?.quantity || 'N/A'),
            createThreeColumnTableRow('', 'Material', formData.fittings?.material || 'N/A')
          ], 90),

          // 添加分页符，开始第四页
          new Paragraph({
            children: [],
            pageBreakBefore: true
          }),

          // 第四页 - 产品图片
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: 'PRODUCT IMAGES',
                font: 'Calibri',
                size: 28,
                bold: true
              })
            ]
          }),

          // 产品图片表格
          createTable([
            await createImageTableRow('Front View', formData.images?.front_img_path),
            await createImageTableRow('Side View', formData.images?.side_img_path),
            await createImageTableRow('Back View', formData.images?.back_view_path),
            await createImageTableRow('Angle View', formData.images?.angle_view_path)
          ], 90),

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
