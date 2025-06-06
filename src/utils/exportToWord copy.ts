import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, AlignmentType, HeadingLevel, BorderStyle, VerticalAlign, WidthType, ImageRun, Media, Header } from 'docx'
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

// 页眉表格宽度配置
const HEADER_TABLE_WIDTHS = {
  LOGO: 2256,        // Logo 列宽度 (25%)
  TITLE: 4964,       // 标题列宽度 (55%)
  CODE: 1806         // 代码列宽度 (20%)
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
      value: 350,
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
          spacing: { before: 40, after: 40 },
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
          spacing: { before: 60, after: 60 },
          children: [new TextRun({
            text: value || '',
            font: 'Calibri',
            size: 16,
            bold: false
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
              alignment: AlignmentType.LEFT,
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
              bold: false
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
              bold: false
            })]
          })]
        })
      ]
    })
  }
}

/**
 * 创建 UPHOLSTERY 表格的特殊行
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
              bold: false
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
              bold: false
            })]
          })]
        })
      ]
    })
  }
}

/**
 * 创建 PRODUCT 表格的特殊行
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
              bold: false
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
              bold: false
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
              bold: false
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
              bold: false
            })]
          })]
        })
      ]
    })
  }
}

/**
 * 创建 PRODUCT DIMENSIONS 表格的特殊行
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
              bold: false
            })]
          })]
        })
      ]
    })
  } else if (rowConfig?.isSecondColumnStart) {
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
              bold: false
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
              bold: false
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
            spacing: { before: 40, after: 40 },
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
        spacing: { before: 40, after: 40 },
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
      columnSpan: 2,
      children: [new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 40, after: 40 },
        children: [new TextRun({
          text: value || '',
          font: 'Calibri',
          size: 20,
          bold: false
        })]
      })]
    })
  )

  return new TableRow({
    height: {
      value: 500,
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
      height: { value: 300, rule: 'atLeast' },
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
              spacing: { before: 40, after: 40 },
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
              bold: false
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
                bold: false
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
                bold: false
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
                bold: false
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
                bold: false
              })]
            })]
          })
        ]
      })
    ]
  }
}

/**
 * 获取图片的二进制数据
 * @param url - 图片URL
 * @returns Promise<Uint8Array | null> - 返回图片的二进制数据
 */
const getImageBuffer = async (url: string): Promise<Uint8Array | null> => {
  try {
    // 将外部URL转换为使用代理的URL
    const proxyUrl = url.startsWith('https://img.shetu66.com')
      ? url.replace('https://img.shetu66.com', '/img-proxy')
      : url

    console.log('正在获取图片:', { originalUrl: url, proxyUrl })

    const response = await fetch(proxyUrl)
    console.log('图片请求响应:', { status: response.status, ok: response.ok })

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

/**
 * 创建图片表格
 * @param imageBuffers - 包含图片二进制数据的对象
 * @returns Table - 返回一个表格对象
 */
const createImageTable = (imageBuffers: { [key: string]: Uint8Array | null }) => {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: {
              size: 50,
              type: WidthType.PERCENTAGE,
            },
            children: imageBuffers.frontImageBuffer ? [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: imageBuffers.frontImageBuffer,
                    transformation: {
                      width: 200,
                      height: 200,
                    },
                    type: 'png',
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ] : [new Paragraph({ text: "No Image" })],
          }),
          new TableCell({
            width: {
              size: 50,
              type: WidthType.PERCENTAGE,
            },
            children: imageBuffers.sideImageBuffer ? [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: imageBuffers.sideImageBuffer,
                    transformation: {
                      width: 200,
                      height: 200
                    },
                    type: 'png',
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ] : [new Paragraph({ text: "No Image" })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: {
              size: 50,
              type: WidthType.PERCENTAGE,
            },
            children: imageBuffers.backImageBuffer ? [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: imageBuffers.backImageBuffer,
                    transformation: {
                      width: 200,
                      height: 200
                    },
                    type: 'png',
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ] : [new Paragraph({ text: "No Image" })],
          }),
          new TableCell({
            width: {
              size: 50,
              type: WidthType.PERCENTAGE,
            },
            children: imageBuffers.angleImageBuffer ? [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: imageBuffers.angleImageBuffer,
                    transformation: {
                      width: 200,
                      height: 200
                    },
                    type: 'png',
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ] : [new Paragraph({ text: "No Image" })],
          }),
        ],
      }),
    ],
  });
};

/**
 * 获取 logo 图片数据
 * @returns Promise<Uint8Array> - 返回 logo 图片的二进制数据
 */
const getLogoBuffer = async (): Promise<Uint8Array> => {
  // 这是一个示例 base64 格式的 TC logo
  const base64Logo = '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';

  // 将 base64 字符串转换为 Uint8Array
  const binaryString = window.atob(base64Logo);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}

/**
 * 导出Word文档
 * @param formData - 包含所有表单数据的对象
 * @returns Promise<Blob> - 返回文档的 Blob 对象
 * @throws 导出失败时抛出错误
 */
export const exportToWord = async (formData: FormData): Promise<Blob> => {
  try {
    console.log('开始处理图片数据:', formData.images)

    // 获取所有图片的 Buffer 数据
    const frontImageBuffer = formData.images?.front_img_path ? await getImageBuffer(formData.images.front_img_path) : null
    const sideImageBuffer = formData.images?.side_img_path ? await getImageBuffer(formData.images.side_img_path) : null
    const backImageBuffer = formData.images?.back_view_path ? await getImageBuffer(formData.images.back_view_path) : null
    const angleImageBuffer = formData.images?.angle_view_path ? await getImageBuffer(formData.images.angle_view_path) : null

    // 获取 logo 图片数据
    let logoBuffer: Uint8Array;
    try {
      logoBuffer = await getLogoBuffer();
      console.log('Logo loaded successfully');
    } catch (error) {
      console.error('Error loading logo:', error);
      // 如果 logo 加载失败，使用一个空的 buffer，但仍然继续生成文档
      logoBuffer = new Uint8Array(0);
    }

    // 检查图片获取结果
    console.log('图片获取结果:', {
      logo: !!logoBuffer,
      frontImage: !!frontImageBuffer,
      sideImage: !!sideImageBuffer,
      backImage: !!backImageBuffer,
      angleImage: !!angleImageBuffer
    })

    // 如果所有图片都获取失败，给出提示
    if (formData.images && !frontImageBuffer && !sideImageBuffer && !backImageBuffer && !angleImageBuffer) {
      console.warn('所有图片获取失败，将继续生成文档但不包含图片')
    }

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 600,
              right: 1200,    // 增加右边距
              bottom: 600,
              left: 1200,     // 增加左边距
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              // Logo 段落
              new Paragraph({
                children: [
                  new ImageRun({
                    data: logoBuffer,
                    transformation: {
                      width: 100,
                      height: 40
                    },
                    type: 'png',
                  }),
                ],
                alignment: AlignmentType.LEFT,
                spacing: { after: 100 }
              }),
              // 地址第一行
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({
                    text: '1300 Aztec West,',
                    size: 16,
                    font: 'Calibri'
                  })
                ]
              }),
              // 地址第二行
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({
                    text: 'Park Avenue,',
                    size: 16,
                    font: 'Calibri'
                  })
                ]
              }),
              // 地址第三行
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({
                    text: 'Aztec West,',
                    size: 16,
                    font: 'Calibri'
                  })
                ]
              }),
              // 地址第四行
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({
                    text: 'Bristol,',
                    size: 16,
                    font: 'Calibri'
                  })
                ]
              }),
              // 地址第五行
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({
                    text: 'BS32 4RX',
                    size: 16,
                    font: 'Calibri'
                  })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({
                    text: '',
                    size: 16,
                    font: 'Calibri'
                  })
                ]
              }),
              // 电话
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({
                    text: 't +44 (0) 01454 207360',
                    size: 16,
                    font: 'Calibri'
                  })
                ]
              }),
              // 传真
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({
                    text: 'f +44 (0) 01454 207367',
                    size: 16,
                    font: 'Calibri'
                  })
                ]
              }),
              // 邮箱
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({
                    text: 'e: productdevelopment@tcoffice.co.uk',
                    size: 16,
                    font: 'Calibri'
                  })
                ]
              }),
              // 页眉下划线
              new Paragraph({
                children: [
                  new TextRun({
                    text: '_______________________________________________________________________________',
                    size: 24,
                    color: "000000"
                  })
                ],
                spacing: { before: 100, after: 100 }
              })
            ]
          })
        },
        children: [
          // 标题
          new Paragraph({
            children: [
              new TextRun({
                text: 'FULL PRODUCT SPECIFICATION SHEET（产品规格表）',
                color: 'FF0000',
                size: 28,
                bold: true,
                underline: {},
                font: 'Arial'
              })
            ],
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { before: 500 , after: 500 }  // 减小标题后的间距
          }),

          // 基本信息表
          createTable([
            createTableRow('TCCODE', formData.tccode || 'N/A'),
            createTableRow('SUPPLIER', formData.supplier || 'N/A'),
            createTableRow('SUPPLIER CODE', formData.supplier_code || 'N/A'),
            createTableRow('SUPPLIER NAME', formData.supplier_name || 'N/A'),
            createTableRow('FIRE STANDARD', formData.fire_standard || 'N/A'),
            createTableRow("FOB 20' CONTAINER PRICE", formData.fob_20_container_price || 'N/A'),
            createTableRow("FOB 40'HC CONTAINER PRICE", formData.fob_40_container_price || 'N/A'),
            createTableRow('SHIPPING PORT', formData.shipping_port || 'N/A'),
          ], 60),

          // 单位说明
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 600 , after: 200 },  // 减小标题后的间距
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
            spacing: { before: 200 , after: 200 },  // 减小标题后的间距
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

          // UPHOLSTERY 表格
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            },
            rows: [
              createUpholsteryTableRow('FABRIC COMPOSITION', formData.upholstery?.fabric_composition || 'N/A', true),
              createUpholsteryTableRow('FABRIC WEIGHT', formData.upholstery?.fabric_weight || 'N/A'),
              createUpholsteryTableRow('MARTINDALE', formData.upholstery?.martindale || 'N/A'),
              createUpholsteryTableRow('LIGHT FASTNESS', formData.upholstery?.light_fastness || 'N/A'),
            ]
          }),



          // CARTON 表格
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            },
            rows: [
              createCartonTableRow('WIDTH', (formData.packaging?.carton_width ? formData.packaging.carton_width + 'MM' : 'N/A'), true),
              createCartonTableRow('DEPTH', (formData.packaging?.carton_length ? formData.packaging.carton_length + 'MM' : 'N/A')),
              createCartonTableRow('HEIGHT', (formData.packaging?.carton_height ? formData.packaging.carton_height + 'MM' : 'N/A')),
              createCartonTableRow('BOARD TYPE', formData.packaging?.board_type || 'N/A'),
              createCartonTableRow('Items per carton', (formData.packaging?.items_per_carton ? formData.packaging.items_per_carton + 'pc' : 'N/A')),
              createCartonTableRow('CARTON VOLUME (m³)', formData.packaging?.carton_volume || 'N/A'),
            ]
          }),



          // PRODUCT 表格
          createTable([
            createProductTableRow('PRODUCTION TIME (DAYS)', (formData.logistics?.production_time ? formData.logistics.production_time + 'Day' : 'N/A'), undefined, true),
            createProductTableRow('EFFECTIVE VOLUME (m³)', formData.logistics?.effective_volume || 'N/A'),
            createProductTableRow('LOADING QUANTITY', formData.logistics?.loading_quantity_20gp || 'N/A', '20\'GP', false, true),
            createProductTableRow('', formData.logistics?.loading_quantity_40hc || 'N/A', '40\'HC'),
            createProductTableRow('WEIGHT (KG)', (formData.logistics?.net_weight ? formData.logistics.net_weight + 'KG' : 'N/A'), 'NET', false, true),
            createProductTableRow('', (formData.logistics?.gross_weight ? formData.logistics.gross_weight + 'KG' : 'N/A'), 'GROSS'),
          ].flat(), 90),



          // PRODUCT DIMENSIONS 表格
          createTable([
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
            spacing: { before: 400, after: 400 },
          }),

          // 第二页的表格
          // SEAT INNER 表格
          createTable([
            createThreeColumnTableRow('SEAT INNER', 'MATERIAL & MANUFACTURER CODE', formData.seat_inner?.material_code || 'N/A', true, 4),
            createThreeColumnTableRow('', 'OVERALL THICKNESS', formData.seat_inner?.thickness || 'N/A'),
            createThreeColumnTableRow('', 'NUMBER OF LAYERS木板层数', formData.seat_inner?.layers_count || 'N/A'),
            createThreeColumnTableRow('', 'DIMENSIONS木板尺寸', formData.seat_inner?.dimensions || 'N/A')
          ], 100),


          // BACK INNER 表格
          createTable([
            createThreeColumnTableRow('BACK INNER', 'MATERIAL & MANUFACTURER CODE', formData.back_inner?.material_code || 'N/A', true, 4),
            createThreeColumnTableRow('', 'NUMBER OF LAYERS木板层数', formData.back_inner?.layers_count || 'N/A'),
            createThreeColumnTableRow('', 'OVERALL THICKNESS', formData.back_inner?.thickness || 'N/A'),
            createThreeColumnTableRow('', 'DIMENSIONS木板尺寸', formData.back_inner?.dimensions || 'N/A')
          ], 100),

          // SEAT OUTER 表格
          createTable([
            createThreeColumnTableRow('SEAT OUTER', 'Material', formData.seat_outer?.material || 'N/A', true, 3),
            createThreeColumnTableRow('', 'Dimensions', formData.seat_outer?.dimensions || 'N/A'),
            createThreeColumnTableRow('', 'Manufacturer Name', formData.seat_outer?.manufacturer_name || 'N/A')
          ], 100),

          // BACK OUTER 表格
          createTable([
            createThreeColumnTableRow('BACK OUTER', 'Material', formData.back_outer?.material || 'N/A', true, 3),
            createThreeColumnTableRow('', 'Dimensions', formData.back_outer?.dimensions || 'N/A'),
            createThreeColumnTableRow('', 'Manufacturer Name', formData.back_outer?.manufacturer_name || 'N/A')
          ], 100),

          // ARMS 表格
          createTable([
            createThreeColumnTableRow('ARMS', 'DESCRIPTION', formData.arms?.description || 'N/A', true, 6),
            createThreeColumnTableRow('', 'MATERIAL', formData.arms?.material || 'N/A'),
            createThreeColumnTableRow('', 'TYPE', formData.arms?.type || 'N/A'),
            createThreeColumnTableRow('', 'MANUFACTURER', formData.arms?.manufacturer || 'N/A'),
            createThreeColumnTableRow('', 'ARM HEIGHT FROM SEAT', formData.arms?.arm_height_from_seat || 'N/A'),
            createThreeColumnTableRow('', 'ARM HEIGHT FROM FLOOR', formData.arms?.arm_height_from_floor || 'N/A')
          ], 100),

          // FOAM 表格
          createTable([
            createFoamTableRow(formData, 'header'),
            ...(createFoamTableRow(formData, 'density') as TableRow[]),
            ...(createFoamTableRow(formData, 'thickness') as TableRow[])
          ].flat(), 100),

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
          ], 100),

          // BASE 表格
          createTable([
            createThreeColumnTableRow('BASE', 'DESCRIPTION', formData.base?.description || 'N/A', true, 4),
            createThreeColumnTableRow('', 'SIZE (R)', formData.base?.size_diameter || 'N/A'),
            createThreeColumnTableRow('', 'MATERIAL', formData.base?.material || 'N/A'),
            createThreeColumnTableRow('', 'TYPE', formData.base?.type || 'N/A')
          ], 100),

          // GAS LIFT 表格
          createTable([
            createThreeColumnTableRow('GAS LIFT', 'DESCRIPTION', formData.gas_lift?.description || 'N/A', true, 5),
            createThreeColumnTableRow('', 'GAS LIFT CLASS (规格)', formData.gas_lift?.gas_lift_class || 'N/A'),
            createThreeColumnTableRow('', 'LENGTH OF CASING (气杆外管)', formData.gas_lift?.casing_length || 'N/A'),
            createThreeColumnTableRow('', 'SIZE OF EXTENSION（行程）', formData.gas_lift?.extension_size || 'N/A'),
            createThreeColumnTableRow('', 'TAPER (MM)', formData.gas_lift?.taper || 'N/A')
          ], 100),

          // GAS LIFT COVER 表格
          createTable([
            createThreeColumnTableRow('GAS LIFT COVER', 'DESCRIPTION', formData.gas_lift_cover?.description || 'N/A', true, 3),
            createThreeColumnTableRow('', 'MATERIAL', formData.gas_lift_cover?.material || 'N/A'),
            createThreeColumnTableRow('', 'COLOUR', formData.gas_lift_cover?.colour || 'N/A')
          ], 100),

          // MECHANISM 表格
          createTable([
            createThreeColumnTableRow('MECHANISM', 'DESCRIPTION', formData.mechanism?.description || 'N/A', true, 5),
            createThreeColumnTableRow('', 'LEVERS', formData.mechanism?.levers_count || 'N/A'),
            createThreeColumnTableRow('', 'LOCKING POSITIONS (锁定位置)', formData.mechanism?.locking_positions || 'N/A'),
            createThreeColumnTableRow('', 'MODEL №', formData.mechanism?.model_no || 'N/A'),
            createThreeColumnTableRow('', 'NAME OF MECH SUPPLIER', formData.mechanism?.supplier_name || 'N/A')
          ], 100),

          // FITTINGS 表格
          createTable([
            createThreeColumnTableRow('FITTINGS', 'Fitting Number', formData.fittings?.fitting_number || 'N/A', true, 4),
            createThreeColumnTableRow('', 'Description', formData.fittings?.description || 'N/A'),
            createThreeColumnTableRow('', 'Quantity', formData.fittings?.quantity || 'N/A'),
            createThreeColumnTableRow('', 'Material', formData.fittings?.material || 'N/A')
          ], 100),

          // 添加分页符，开始第四页
          new Paragraph({
            children: [],
            pageBreakBefore: true,
            spacing: { before: 400, after: 400 }
          }),

          // 第四页 - 产品图片表格
          new Table({
            width: {
              size: TOTAL_WIDTH,
              type: WidthType.DXA
            },
            alignment: AlignmentType.CENTER,
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE }
            },
            rows: [
              // 第一行：正视图和侧视图
              new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: TOTAL_WIDTH / 2,
                      type: WidthType.DXA
                    },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    margins: {
                      top: 400,
                      bottom: 400,
                      left: 400,
                      right: 400,
                    },
                    children: frontImageBuffer ? [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new ImageRun({
                            data: frontImageBuffer,
                            transformation: {
                              width: 200,
                              height: 267
                            },
                            type: 'png',
                          }),
                        ]
                      })
                    ] : [new Paragraph({ text: 'No image' })]
                  }),
                  new TableCell({
                    width: {
                      size: TOTAL_WIDTH / 2,
                      type: WidthType.DXA
                    },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    margins: {
                      top: 400,
                      bottom: 400,
                      left: 400,
                      right: 400,
                    },
                    children: sideImageBuffer ? [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new ImageRun({
                            data: sideImageBuffer,
                            transformation: {
                              width: 200,
                              height: 267
                            },
                            type: 'png',
                          }),
                        ]
                      })
                    ] : [new Paragraph({ text: 'No image' })]
                  })
                ],
                height: {
                  value: 500,
                  rule: 'atLeast'
                }
              }),
              // 第二行：背视图和角视图
              new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: TOTAL_WIDTH / 2,
                      type: WidthType.DXA
                    },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    margins: {
                      top: 400,
                      bottom: 400,
                      left: 400,
                      right: 400,
                    },
                    children: backImageBuffer ? [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new ImageRun({
                            data: backImageBuffer,
                            transformation: {
                              width: 200,
                              height: 267
                            },
                            type: 'png',
                          }),
                        ]
                      })
                    ] : [new Paragraph({ text: 'No image' })]
                  }),
                  new TableCell({
                    width: {
                      size: TOTAL_WIDTH / 2,
                      type: WidthType.DXA
                    },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    margins: {
                      top: 400,
                      bottom: 400,
                      left: 400,
                      right: 400,
                    },
                    children: angleImageBuffer ? [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new ImageRun({
                            data: angleImageBuffer,
                            transformation: {
                              width: 200,
                              height: 267
                            },
                            type: 'png',
                          }),
                        ]
                      })
                    ] : [new Paragraph({ text: 'No image' })]
                  })
                ],
                height: {
                  value: 500,
                  rule: 'atLeast'
                }
              })
            ]
          }),

          // 添加分页符，开始第四页
          new Paragraph({
            children: [],
            pageBreakBefore: true,
            spacing: { before: 3400, after: 3400 }
          }),

          // FOR TC GROUP INTERNAL USE ONLY 标题
          new Paragraph({
            children: [
              new TextRun({
                text: '*FOR TC GROUP INTERNAL USE ONLY*',
                size: 24,
                bold: true,
                font: 'Arial',
                underline: {}
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 }
          }),

          // 创建内部使用信息表格
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            },
            rows: [
              // INITIAL MONTHLY FORECAST
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'INITIAL MONTHLY FORECAST',
                            size: 20,
                            bold: true,
                            font: 'Arial'
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'N/A',
                            size: 20,
                            font: 'Arial',
                            bold: false
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              // PRODUCTION COLOURS
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'PRODUCTION COLOURS',
                            size: 20,
                            bold: true,
                            font: 'Arial'
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'N/A',
                            size: 20,
                            font: 'Arial',
                            bold: false
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              // 空行
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: '' })]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'N/A',
                            size: 20,
                            font: 'Arial',
                            bold: false
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          // 添加间隔
          new Paragraph({
            spacing: { after: 120 }
          }),

          // 创建产品信息表格
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            },
            rows: [
              // TC CODE & CUSTOMER PRODUCT CODE
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 15, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'TC CODE',
                            size: 20,
                            bold: true,
                            font: 'Arial'
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'CH0001',
                            size: 20,
                            font: 'Arial',
                            bold: false
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'CUSTOMER PRODUCT CODE',
                            size: 20,
                            bold: true,
                            font: 'Arial'
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'N/A',
                            size: 20,
                            font: 'Arial',
                            bold: false
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              // TC BARCODE & CUSTOMER BARCODE
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'TC BARCODE',
                            size: 20,
                            bold: true,
                            font: 'Arial'
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'CH0001BK:505668130765\nCH0001CH:505668130767\nCH0001RB:505668130764',
                            size: 20,
                            font: 'Arial',
                            bold: false
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'CUSTOMER BARCODE',
                            size: 20,
                            bold: true,
                            font: 'Arial'
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'N/A',
                            size: 20,
                            font: 'Arial',
                            bold: false
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              // TC PRODUCT NAME & CUSTOMER PRODUCT NAME
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'TC PRODUCT NAME',
                            size: 20,
                            bold: true,
                            font: 'Arial'
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'N/A',
                            size: 20,
                            font: 'Arial',
                            bold: false
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'CUSTOMER PRODUCT NAME',
                            size: 20,
                            bold: true,
                            font: 'Arial'
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'N/A',
                            size: 20,
                            font: 'Arial',
                            bold: false
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              // FACTORY CODE & FACTORY PRODUCT NAME
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'FACTORY CODE',
                            size: 20,
                            bold: true,
                            font: 'Arial'
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'H-308BF',
                            size: 20,
                            font: 'Arial',
                            bold: false
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'FACTORY PRODUCT NAME',
                            size: 20,
                            bold: true,
                            font: 'Arial'
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'N/A',
                            size: 20,
                            font: 'Arial',
                            bold: false
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          // 添加间隔
          new Paragraph({
            spacing: { after: 120 }
          }),

          // 添加测试报告要求文本
          new Paragraph({
            children: [
              new TextRun({
                text: 'COPIES OF COMPONENT TEST REPORTS REQUIRED',
                size: 24,
                bold: true,
                font: 'Arial'
              })
            ],
            alignment: AlignmentType.CENTER
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '** COPIES OF COMPONENT TEST REPORTS REQUIRED (STRENGTH AND STABILITY)',
                size: 24,
                bold: true,
                font: 'Arial'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 }
          }),

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
                line: 240
              }
            }
          }
        ]
      }
    })

    // 生成文档
    const buffer = await Packer.toBlob(doc)
    // 使用 product_code 构建文件名
    const fileName = `Master Specification Sheet---${formData.product_code || 'Unknown'}.docx`
    if (!formData.is_batch_export) {
      saveAs(buffer, fileName)
    }
    return buffer
  } catch (error) {
    console.error('导出失败:', error)
    throw error
  }
}
