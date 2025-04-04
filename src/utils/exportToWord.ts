import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, AlignmentType, HeadingLevel, BorderStyle, VerticalAlign, WidthType, ImageRun, Media, Header } from 'docx'
import { saveAs } from 'file-saver'
import { LOGO } from './excelUtils'
import type { ProductDto } from '@/api/interface'
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
  if (!url) {
    console.log('图片URL为空')
    return null
  }

  try {
    // 清理URL
    let cleanUrl = url.trim()
    
    // 移除可能的前导@符号
    cleanUrl = cleanUrl.replace(/^@/, '')
    
    // 如果URL没有协议前缀，添加http://
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'http://' + cleanUrl
    }

    console.log('处理后的图片URL:', cleanUrl)

    // 创建一个新的图片元素
    const img = new Image()
    
    // 返回Promise以处理图片加载
    return new Promise((resolve, reject) => {
      img.crossOrigin = 'anonymous'  // 设置跨域
      
      img.onload = () => {
        try {
          // 创建canvas
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          
          // 获取context并绘制图片
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            console.error('无法获取canvas context')
            resolve(null)
            return
          }
          
          // 绘制图片
          ctx.drawImage(img, 0, 0)
          
          // 转换为blob
          canvas.toBlob(async (blob) => {
            if (!blob) {
              console.error('无法创建blob')
              resolve(null)
              return
            }
            
            // 转换为ArrayBuffer
            const arrayBuffer = await blob.arrayBuffer()
            resolve(new Uint8Array(arrayBuffer))
          }, 'image/png')
        } catch (error) {
          console.error('处理图片时出错:', error)
          resolve(null)
        }
      }

      img.onerror = () => {
        console.warn(`加载图片失败: ${cleanUrl}`)
        resolve(null)
      }

      // 设置图片源
      img.src = cleanUrl
    })
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
 * @param productDto - 包含所有产品数据的ProductDto对象
 * @param options - 导出选项
 * @returns Promise<Blob> - 返回文档的 Blob 对象
 * @throws 导出失败时抛出错误
 */
export const exportToWord = async (productDto: ProductDto, options?: {is_batch_export?: boolean}): Promise<Blob> => {
  try {
    console.log('开始处理产品数据:', productDto)

    // 转换ProductDto为导出所需的数据结构
    const formData: FormData = {
      // 基本信息和文件名
      products: productDto.products || {},
      product_code: productDto.products?.tccode || 'Unknown',

      // TC GROUP INTERNAL USE ONLY 表格所需字段
      initialMonthlyForecast: '', // 使用空字符串代替 'N/A'
      productionColours: '', // 使用空字符串代替 'N/A'
      customerProductCode: '', // 使用空字符串代替 'N/A'
      customerBarcode: '', // 使用空字符串代替 'N/A'
      customerProductName: '', // 使用空字符串代替 'N/A'
      factoryProductName: '', // 使用空字符串代替 'N/A'

      // 使用 TC 相关字段代替默认字段
      tc_code: productDto.products?.tccode || '',
      tc_barcode: '', // API中没有此字段，暂时留空
      tc_product_name: productDto.products?.supplier || '', // 假设supplier可用作产品名称
      factory_code: productDto.products?.supplierCode || '',

      // 图片数据特殊处理：将驼峰命名的字段名转换为下划线格式
      images: {
        front_img_path: productDto.productImages?.frontImgPath || '',
        side_img_path: productDto.productImages?.sideImgPath || '',
        back_view_path: productDto.productImages?.backImgPath || '',
        angle_view_path: productDto.productImages?.angleImgPath || ''
      },

      // 座椅内部结构
      seatInner: {
        materialCode: productDto.seatInnerComponents?.materialCode || '',
        thickness: String(productDto.seatInnerComponents?.thickness || ''),
        layersCount: String(productDto.seatInnerComponents?.layersCount || ''),
        dimensions: productDto.seatInnerComponents?.dimensions || ''
      },

      // 背部内部结构
      backInner: {
        materialCode: productDto.backInnerComponents?.materialCode || '',
        thickness: String(productDto.backInnerComponents?.thickness || ''),
        layersCount: String(productDto.backInnerComponents?.layersCount || ''),
        dimensions: productDto.backInnerComponents?.dimensions || ''
      },

      // 座椅外部结构
      seatOuter: {
        material: productDto.seatOuterComponents?.material || '',
        dimensions: productDto.seatOuterComponents?.dimensions || '',
        manufacturerName: productDto.seatOuterComponents?.manufacturerName || ''
      },

      // 背部外部结构
      backOuter: {
        material: productDto.backOuterComponents?.material || '',
        dimensions: productDto.backOuterComponents?.dimensions || '',
        manufacturerName: productDto.backOuterComponents?.manufacturerName || ''
      },

      // 扶手信息
      arms: {
        description: productDto.arms?.description || '',
        material: productDto.arms?.material || '',
        type: productDto.arms?.type || '',
        manufacturer: productDto.arms?.manufacturer || '',
        arm_height_from_seat: String(productDto.arms?.armHeightFromSeat || ''),
        arm_height_from_floor: String(productDto.arms?.armHeightFromFloor || '')
      },

      // 泡棉信息
      foam: {
        description: productDto.foamDetails?.description || '',
        seat_density: String(productDto.foamDetails?.seatDensity || ''),
        back_density: String(productDto.foamDetails?.backDensity || ''),
        seat_thickness: String(productDto.foamDetails?.seatThickness || ''),
        back_thickness: String(productDto.foamDetails?.backThickness || '')
      },

      // 脚轮信息
      castors: {
        description: productDto.castors?.description || '',
        pin_thickness: String(productDto.castors?.pinThickness || ''),
        wheel_diameter: String(productDto.castors?.wheelDiameter || '')
      },

      // 底座信息
      base: {
        description: productDto.bases?.description || '',
        size_diameter: String(productDto.bases?.sizeDiameter || ''),
        material: productDto.bases?.material || '',
        type: productDto.bases?.type || ''
      },

      // 气压棒信息
      gasLift: {
        description: productDto.gasLift?.description || '',
        gasLiftClass: productDto.gasLift?.gasLiftClass || '',
        casingLength: String(productDto.gasLift?.casingLength || ''),
        extensionSize: String(productDto.gasLift?.extensionSize || ''),
        taper: String(productDto.gasLift?.taper || '')
      },

      // 气压罩信息
      gasLiftCover: {
        description: productDto.gasLiftCover?.description || '',
        material: productDto.gasLiftCover?.material || '',
        colour: productDto.gasLiftCover?.colour || ''
      },

      // 机构信息
      mechanism: {
        description: productDto.mechanism?.description || '',
        leversCount: String(productDto.mechanism?.leversCount || ''),
        lockingPositions: productDto.mechanism?.lockingPositions || '',
        modelNo: productDto.mechanism?.modelNo || '',
        supplierName: productDto.mechanism?.supplierName || ''
      },

      // 配件信息
      fittings: {
        fittingNumber: String(productDto.fittings?.fittingNumber || ''),
        description: productDto.fittings?.description || '',
        quantity: String(productDto.fittings?.quantity || ''),
        material: productDto.fittings?.material || ''
      },

      // 包装信息
      packaging: {
        width: String(productDto.cartonDetails?.width || ''),
        depth: String(productDto.cartonDetails?.depth || ''),
        height: String(productDto.cartonDetails?.height || ''),
        boardType: productDto.cartonDetails?.boardType || '',
        itemsPerCarton: String(productDto.cartonDetails?.itemsPerCarton || ''),
        cartonVolume: String(productDto.cartonDetails?.cartonVolume || '')
      },

      // 物流信息 - 确保字段名与模板匹配
      logistics: {
        production_time: String(productDto.productionLogistics?.productionTime || ''),
        effective_volume: String(productDto.productionLogistics?.effectiveVolume || ''),
        loading_quantity_20gp: String(productDto.productionLogistics?.loadingQuantity20gp || ''),
        loading_quantity_40hc: String(productDto.productionLogistics?.loadingQuantity40hc || ''),
        net_weight: String(productDto.productionLogistics?.netWeight || ''),
        gross_weight: String(productDto.productionLogistics?.grossWeight || '')
      },

      // 尺寸信息 - 确保字段名与模板匹配
      dimensions: {
        seat_width: String(productDto.productDimensions?.seatWidth || ''),
        seat_depth: String(productDto.productDimensions?.seatDepth || ''),
        back_width: String(productDto.productDimensions?.backWidth || ''),
        back_height: String(productDto.productDimensions?.backHeight || ''),
        seat_height_min: String(productDto.productDimensions?.seatHeightMin || ''),
        seat_height_max: String(productDto.productDimensions?.seatHeightMax || ''),
        back_height_from_seat: String(productDto.productDimensions?.backHeightFromSeat || ''),
        overall_width: String(productDto.productDimensions?.overallWidth || ''),
        overall_depth: String(productDto.productDimensions?.overallDepth || ''),
        overall_height_min: String(productDto.productDimensions?.overallHeightMin || ''),
        overall_height_max: String(productDto.productDimensions?.overallHeightMax || '')
      },

      // 面料信息
      upholstery: {
        fabricManufacturer: productDto.upholstery?.fabricManufacturer || '',
        colourCode: productDto.upholstery?.colourCode || '',
        leatherGrade: productDto.upholstery?.leatherGrade || '',
        usagePerChair: String(productDto.upholstery?.usagePerChair || '')
      },

      // 添加一个标记，表示这是否是批量导出
      is_batch_export: options?.is_batch_export || false
    }

    console.log('开始处理图片数据:', formData.images)

    // 获取所有图片的 Buffer 数据
    let frontImageBuffer, sideImageBuffer, backImageBuffer, angleImageBuffer;
    try {
      frontImageBuffer = formData.images?.front_img_path ? await getImageBuffer(formData.images.front_img_path) : null
    } catch (error) {
      console.error('获取正面图片失败:', error)
      frontImageBuffer = null
    }
    
    try {
      sideImageBuffer = formData.images?.side_img_path ? await getImageBuffer(formData.images.side_img_path) : null
    } catch (error) {
      console.error('获取侧面图片失败:', error)
      sideImageBuffer = null
    }
    
    try {
      backImageBuffer = formData.images?.back_view_path ? await getImageBuffer(formData.images.back_view_path) : null
    } catch (error) {
      console.error('获取背面图片失败:', error)
      backImageBuffer = null
    }
    
    try {
      angleImageBuffer = formData.images?.angle_view_path ? await getImageBuffer(formData.images.angle_view_path) : null
    } catch (error) {
      console.error('获取角度图片失败:', error)
      angleImageBuffer = null
    }

    // 获取 logo 图片数据
    let logoBuffer;
    try {
      logoBuffer = await getLogoBuffer();
      console.log('Logo加载成功');
    } catch (error) {
      console.error('Logo加载失败:', error);
      // 如果logo加载失败，使用空buffer
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
            spacing: { before: 120, after: 120 },
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
            spacing: { before: 0, after: 120 },
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
              createUpholsteryTableRow('FABRIC MANUFACTURER', formatValueByField(formData.upholstery?.fabricManufacturer, 'fabricManufacturer') || 'N/A', true),
              createUpholsteryTableRow('COLOUR CODE', formatValueByField(formData.upholstery?.colourCode, 'colourCode') || 'N/A'),
              createUpholsteryTableRow('LEATHER GRADE (WHERE APPLICABLE)', formatValueByField(formData.upholstery?.leatherGrade, 'leatherGrade') || 'N/A'),
              createUpholsteryTableRow('USAGE PER CHAIR（BACK/SEAT）', formatValueByField(formData.upholstery?.usagePerChair, 'usagePerChair') || 'Gray fabric:0.9m'),
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
              createCartonTableRow('WIDTH', '380MM', true),
              createCartonTableRow('DEPTH', '640MM'),
              createCartonTableRow('HEIGHT', '600MM'),
              createCartonTableRow('BOARD TYPE', '250lbs, 5 layers twin walled'),
              createCartonTableRow('Items per carton', '1pc'),
              createCartonTableRow('CARTON VOLUME (m³)', '0.146'),
            ]
          }),



          // PRODUCT 表格
          createTable([
            createProductTableRow('PRODUCTION TIME (DAYS)', '30Day', undefined, true),
            createProductTableRow('EFFECTIVE VOLUME (m³)', '0.157'),
            createProductTableRow('LOADING QUANTITY', '180', '20\'GP', false, true),
            createProductTableRow('', '432', '40\'HC'),
            createProductTableRow('WEIGHT (KG)', '10.8KG', 'NET', false, true),
            createProductTableRow('', '12.4KG', 'GROSS'),
          ].flat(), 90),



          // PRODUCT DIMENSIONS 表格
          createTable([
            createProductDimensionsTableRow('WIDTH', '490MM', 'SEAT', true),
            createProductDimensionsTableRow('DEPTH', '450MM'),
            createProductDimensionsTableRow('WIDTH', '460MM', 'BACK', false, { isSecondColumnStart: true, rowSpan: 2, secondColumnText: 'BACK' }),
            createProductDimensionsTableRow('HEIGHT', '510MM'),
            createProductDimensionsTableRow('MIN', '465MM', 'SEAT HEIGHT', false, { isSecondColumnStart: true, rowSpan: 2, secondColumnText: 'SEAT HEIGHT' }),
            createProductDimensionsTableRow('MAX', '585MM'),
            createProductDimensionsTableRow('FROM SEAT', '485-550MM', 'BACK HEIGHT', false, { isSecondColumnStart: true, rowSpan: 1, secondColumnText: 'BACK HEIGHT' }),
            createProductDimensionsTableRow('WIDTH', '590MM', 'OVERALL', false, { isSecondColumnStart: true, rowSpan: 3, secondColumnText: 'OVERALL' }),
            createProductDimensionsTableRow('DEPTH', '555-900MM'),
            createProductDimensionsTableRow('HEIGHT', '930-1050MM\n970-1090MM'),
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
                              height: 200
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
                              height: 200
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
                              height: 200
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
                              height: 200
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
