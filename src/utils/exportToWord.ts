import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, AlignmentType, HeadingLevel, BorderStyle, VerticalAlign, WidthType, ImageRun, Media, Header } from 'docx'
import { saveAs } from 'file-saver'
import { LOGO } from './excelUtils'
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



// 四列表格的宽度配置
const FOUR_COLUMN_WIDTHS = {
  FIRST: 2256,   // 25%
  SECOND: 3159,  // 35%
  THIRD: 1805,   // 20%
  FOURTH: 1806   // 20%
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
 * 获取 logo 图片数据
 * @returns Promise<Uint8Array> - 返回 logo 图片的二进制数据
 */
const getLogoBuffer = async (): Promise<Uint8Array> => {
  try {
    // 移除可能存在的 base64 前缀
    const base64Data = LOGO.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    
    // 将 base64 字符串转换为 Uint8Array
    const binaryString = window.atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    console.log('Logo 数据已成功转换', { 
      originalLength: LOGO.length,
      processedLength: base64Data.length,
      binaryLength: bytes.length 
    });
    
    return bytes;
  } catch (error) {
    console.error('Logo 转换失败:', error);
    // 返回一个空的 Uint8Array，而不是抛出错误
    return new Uint8Array(0);
  }
}

/**
 * 将任意值转换为显示字符串
 * @param value - 要转换的值
 * @param unit - 可选的单位（如 'MM', 'KG' 等）
 * @returns string - 格式化后的字符串
 */
const formatValue = (value: any, unit: string = ''): string => {
  if (value === null || value === undefined) {
    return 'N/A';
  }

  // 如果是数字类型，转换为字符串并添加单位
  if (typeof value === 'number') {
    // 对于小数，保留两位小数
    const formattedNumber = Number.isInteger(value) ? value.toString() : value.toFixed(2);
    return `${formattedNumber}${unit ? ' ' + unit : ''}`;
  }

  // 如果是字符串类型且不为空
  if (typeof value === 'string' && value.trim()) {
    return `${value}${unit ? ' ' + unit : ''}`;
  }

  // 其他情况返回 N/A
  return 'N/A';
}

/**
 * 根据字段名自动判断单位的格式化函数
 * @param value - 要转换的值
 * @param fieldName - 字段名
 * @returns string - 格式化后的字符串
 */
const formatValueByField = (value: any, fieldName: string): string => {
  // 根据字段名判断单位
  if (/height|width|depth|diameter|thickness|length|size/i.test(fieldName)) {
    return formatValue(value, 'MM');
  }
  if (/weight/i.test(fieldName)) {
    return formatValue(value, 'KG');
  }
  if (/density/i.test(fieldName)) {
    return formatValue(value, 'kg/m³');
  }
  if (/volume/i.test(fieldName)) {
    return formatValue(value, 'm³');
  }
  if (/price/i.test(fieldName)) {
    return formatValue(value, 'USD');
  }
  if (/quantity|count|number/i.test(fieldName)) {
    return formatValue(value, 'pc');
  }
  if (/time/i.test(fieldName)) {
    return formatValue(value, 'Day');
  }

  // 默认不添加单位
  return formatValue(value);
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
                  ...(logoBuffer.length > 0 ? [
                    new ImageRun({
                      data: logoBuffer,
                      transformation: {
                        width: 100,
                        height: 40
                      },
                      type: 'png',
                    })
                  ] : [
                    new TextRun({
                      text: 'TC GROUP',  // 当 logo 加载失败时显示文字
                      size: 24,
                      bold: true,
                      font: 'Arial'
                    })
                  ]),
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
            createTableRow('TCCODE', formData.products?.tccode || 'N/A'),
            createTableRow('SUPPLIER', formData.products?.supplier || 'N/A'),
            createTableRow('SUPPLIER CODE', formatValueByField(formData.products?.supplierCode, 'supplierCode')),
            createTableRow('SUPPLIER NAME', formData.products?.supplierName || 'N/A'),
            createTableRow('FIRE STANDARD', formData.products?.fireStandard || 'N/A'),
            createTableRow("FOB 20' CONTAINER PRICE", formatValueByField(formData.products?.fob20ContainerPrice, 'fob20ContainerPrice')),
            createTableRow("FOB 40'HC CONTAINER PRICE", formatValueByField(formData.products?.fob40ContainerPrice, 'fob40ContainerPrice')),
            createTableRow('SHIPPING PORT', formData.products?.shippingPort || 'N/A'),
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
              createUpholsteryTableRow('FABRIC COMPOSITION', formatValueByField(formData.upholstery?.fabricManufacturer, 'fabricManufacturer'), true),
              createUpholsteryTableRow('FABRIC WEIGHT', formatValueByField(formData.upholstery?.colourCode, 'colourCode')),
              createUpholsteryTableRow('MARTINDALE', formatValueByField(formData.upholstery?.leatherGrade, 'leatherGrade')),
              createUpholsteryTableRow('LIGHT FASTNESS', formatValueByField(formData.upholstery?.usagePerChair, 'usagePerChair')),
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
              createCartonTableRow('WIDTH', formatValueByField(formData.packaging?.width, 'width'), true),
              createCartonTableRow('DEPTH', formatValueByField(formData.packaging?.depth, 'depth')),
              createCartonTableRow('HEIGHT', formatValueByField(formData.packaging?.height, 'height')),
              createCartonTableRow('BOARD TYPE', formData.packaging?.boardType || 'N/A'),
              createCartonTableRow('Items per carton', (formData.packaging?.itemsPerCarton ? formData.packaging.itemsPerCarton + 'pc' : 'N/A')),
              createCartonTableRow('CARTON VOLUME (m³)', formatValueByField(formData.packaging?.cartonVolume, 'cartonVolume')),
            ]
          }),



          // PRODUCT 表格
          createTable([
            createProductTableRow('PRODUCTION TIME (DAYS)', (formData.logistics?.production_time ? formData.logistics.production_time + 'Day' : 'N/A'), undefined, true),
            createProductTableRow('EFFECTIVE VOLUME (m³)', formatValueByField(formData.logistics?.effective_volume, 'effective_volume')),
            createProductTableRow('LOADING QUANTITY', formatValueByField(formData.logistics?.loading_quantity_20gp, 'loading_quantity_20gp') || 'N/A', '20\'GP', false, true),
            createProductTableRow('', formatValueByField(formData.logistics?.loading_quantity_40hc, 'loading_quantity_40hc') || 'N/A', '40\'HC'),
            createProductTableRow('WEIGHT (KG)', (formData.logistics?.net_weight ? formData.logistics.net_weight + 'KG' : 'N/A'), 'NET', false, true),
            createProductTableRow('', (formData.logistics?.gross_weight ? formData.logistics.gross_weight + 'KG' : 'N/A'), 'GROSS'),
          ].flat(), 90),



          // PRODUCT DIMENSIONS 表格
          createTable([
            createProductDimensionsTableRow('WIDTH', formatValueByField(formData.dimensions?.seat_width, 'seat_width'), 'SEAT', true),
            createProductDimensionsTableRow('DEPTH', formatValueByField(formData.dimensions?.seat_depth, 'seat_depth')),
            createProductDimensionsTableRow('WIDTH', formatValueByField(formData.dimensions?.back_width, 'back_width'), 'BACK', false, { isSecondColumnStart: true, rowSpan: 2, secondColumnText: 'BACK' }),
            createProductDimensionsTableRow('HEIGHT', formatValueByField(formData.dimensions?.back_height, 'back_height')),
            createProductDimensionsTableRow('MIN', formatValueByField(formData.dimensions?.seat_height_min, 'seat_height_min'), 'SEAT HEIGHT', false, { isSecondColumnStart: true, rowSpan: 2, secondColumnText: 'SEAT HEIGHT' }),
            createProductDimensionsTableRow('MAX', formatValueByField(formData.dimensions?.seat_height_max, 'seat_height_max')),
            createProductDimensionsTableRow('FROM SEAT', formatValueByField(formData.dimensions?.back_height_from_seat, 'back_height_from_seat'), 'SEAT HEIGHT', false, { isSecondColumnStart: true, rowSpan: 1, secondColumnText: 'SEAT HEIGHT' }),
            createProductDimensionsTableRow('WIDTH', formatValueByField(formData.dimensions?.overall_width, 'overall_width'), 'OVERALL', false, { isSecondColumnStart: true, rowSpan: 3, secondColumnText: 'OVERALL' }),
            createProductDimensionsTableRow('DEPTH', formatValueByField(formData.dimensions?.overall_depth, 'overall_depth')),
            createProductDimensionsTableRow('HEIGHT', formatValueByField(formData.dimensions?.overall_height_min, 'overall_height_min'))
          ].flat(), 90),

          // 添加分页符，开始第二页
          new Paragraph({
            spacing: { before: 400, after: 400 },
          }),

          // 第二页的表格
          // SEAT INNER 表格
          createTable([
            createThreeColumnTableRow('SEAT INNER', 'MATERIAL & MANUFACTURER CODE', formData.seatInner?.materialCode || 'N/A', true, 4),
            createThreeColumnTableRow('', 'OVERALL THICKNESS', formData.seatInner?.thickness || 'N/A'),
            createThreeColumnTableRow('', 'NUMBER OF LAYERS木板层数', formData.seatInner?.layersCount || 'N/A'),
            createThreeColumnTableRow('', 'DIMENSIONS木板尺寸', formData.seatInner?.dimensions || 'N/A'),
          ], 100),


          // BACK INNER 表格
          createTable([
            createThreeColumnTableRow('BACK INNER', 'MATERIAL & MANUFACTURER CODE', formData.backInner?.materialCode || 'N/A', true, 4),
            createThreeColumnTableRow('', 'NUMBER OF LAYERS木板层数', formData.backInner?.layersCount || 'N/A'),
            createThreeColumnTableRow('', 'OVERALL THICKNESS', formData.backInner?.thickness || 'N/A'),
            createThreeColumnTableRow('', 'DIMENSIONS木板尺寸', formData.backInner?.dimensions || 'N/A'),
          ], 100),

          // SEAT OUTER 表格
          createTable([
            createThreeColumnTableRow('SEAT OUTER', 'Material', formData.seatOuter?.material || 'N/A', true, 3),
            createThreeColumnTableRow('', 'Dimensions', formData.seatOuter?.dimensions || 'N/A'),
            createThreeColumnTableRow('', 'Manufacturer Name', formData.seatOuter?.manufacturerName || 'N/A'),
          ], 100),

          // BACK OUTER 表格
          createTable([
            createThreeColumnTableRow('BACK OUTER', 'Material', formData.backOuter?.material || 'N/A', true, 3),
            createThreeColumnTableRow('', 'Dimensions', formData.backOuter?.dimensions || 'N/A'),
            createThreeColumnTableRow('', 'Manufacturer Name', formData.backOuter?.manufacturerName || 'N/A'),
          ], 100),

          // ARMS 表格
          createTable([
            createThreeColumnTableRow('ARMS', 'DESCRIPTION', formData.arms?.description || 'N/A', true, 6),
            createThreeColumnTableRow('', 'MATERIAL', formData.arms?.material || 'N/A'),
            createThreeColumnTableRow('', 'TYPE', formData.arms?.type || 'N/A'),
            createThreeColumnTableRow('', 'MANUFACTURER', formData.arms?.manufacturer || 'N/A'),
            createThreeColumnTableRow('', 'ARM HEIGHT FROM SEAT', formData.arms?.arm_height_from_seat || 'N/A'),
            createThreeColumnTableRow('', 'ARM HEIGHT FROM FLOOR', formData.arms?.arm_height_from_floor || 'N/A'),
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
            createThreeColumnTableRow('', 'SIZE/WHEEL DIAMETER (Ф)', formData.castors?.wheel_diameter || 'N/A'),
          ], 100),

          // BASE 表格
          createTable([
            createThreeColumnTableRow('BASE', 'DESCRIPTION', formData.base?.description || 'N/A', true, 4),
            createThreeColumnTableRow('', 'SIZE (R)', formData.base?.size_diameter || 'N/A'),
            createThreeColumnTableRow('', 'MATERIAL', formData.base?.material || 'N/A'),
            createThreeColumnTableRow('', 'TYPE', formData.base?.type || 'N/A'),
          ], 100),

          // GAS LIFT 表格
          createTable([
            createThreeColumnTableRow('GAS LIFT', 'DESCRIPTION', formData.gasLift?.description || 'N/A', true, 5),
            createThreeColumnTableRow('', 'GAS LIFT CLASS (规格)', formData.gasLift?.gasLiftClass || 'N/A'),
            createThreeColumnTableRow('', 'LENGTH OF CASING (气杆外管)', formData.gasLift?.casingLength || 'N/A'),
            createThreeColumnTableRow('', 'SIZE OF EXTENSION（行程）', formData.gasLift?.extensionSize || 'N/A'),
            createThreeColumnTableRow('', 'TAPER (MM)', formData.gasLift?.taper || 'N/A'),
          ], 100),

          // GAS LIFT COVER 表格
          createTable([
            createThreeColumnTableRow('GAS LIFT COVER', 'DESCRIPTION', formData.gasLiftCover?.description || 'N/A', true, 3),
            createThreeColumnTableRow('', 'MATERIAL', formData.gasLiftCover?.material || 'N/A'),
            createThreeColumnTableRow('', 'COLOUR', formData.gasLiftCover?.colour || 'N/A'),
          ], 100),

          // MECHANISM 表格
          createTable([
            createThreeColumnTableRow('MECHANISM', 'DESCRIPTION', formData.mechanism?.description || 'N/A', true, 5),
            createThreeColumnTableRow('', 'LEVERS', formData.mechanism?.leversCount || 'N/A'),
            createThreeColumnTableRow('', 'LOCKING POSITIONS (锁定位置)', formData.mechanism?.lockingPositions || 'N/A'),
            createThreeColumnTableRow('', 'MODEL №', formData.mechanism?.modelNo || 'N/A'),
            createThreeColumnTableRow('', 'NAME OF MECH SUPPLIER', formData.mechanism?.supplierName || 'N/A'),
          ], 100),

          // FITTINGS 表格
          createTable([
            createThreeColumnTableRow('FITTINGS', 'Fitting Number', formData.fittings?.fittingNumber || 'N/A', true, 4),
            createThreeColumnTableRow('', 'Description', formData.fittings?.description || 'N/A'),
            createThreeColumnTableRow('', 'Quantity', formData.fittings?.quantity || 'N/A'),
            createThreeColumnTableRow('', 'Material', formData.fittings?.material || 'N/A'),
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
