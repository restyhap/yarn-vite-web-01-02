import type {ImagePosition} from 'exceljs';
import ExcelJS from 'exceljs';
import {LOGO} from './excelUtils';
import {base64ToUint8Array} from './imageUtils';

// 添加 Buffer polyfill
const BufferPolyfill = {
  from: (data: string | Uint8Array, encoding?: string): Uint8Array => {
    if (typeof data === 'string' && encoding === 'base64') {
      return base64ToUint8Array(data);
    }
    if (data instanceof Uint8Array) {
      return data;
    }
    throw new Error('Unsupported buffer conversion');
  }
};

// 使用 BufferPolyfill 替代 Buffer
const getBuffer = (data: string | Uint8Array, encoding?: string): any => {
  return BufferPolyfill.from(data, encoding);
};

interface QuotationData {
  quote_no?: string;
  supplier: string;
  supplier_item_code: string;
  quote_date: string;
  specification_details: string;
  sample_lead_time: string;
  overall_dimensions_width: number;
  overall_dimensions_depth: number;
  overall_dimensions_height: number;
  box_dimensions_width: number;
  box_dimensions_depth: number;
  box_dimensions_height: number;
  box_weight_net_weighth: number;
  net_weight_gross_weight: string;
  effective_vol: string;
  loading_qty: number;
  moq: string;
  fob_price: number;
  currency: number;
  bifma_tested: boolean | number;
  cad_block_available: boolean | number;
  product_data_available: boolean | number;
  product_images_available: boolean | number;
  sales_contacts: string;
  valid_period: string;
  port: string;
  remark: string;
  create_time?: string;
  image?: string;
}

/**
 * 获取图片的二进制数据
 * @param url - 图片URL
 * @returns Promise<Uint8Array | null> - 返回图片的二进制数据
 */
const getImageBuffer = async (url: string): Promise<Uint8Array | null> => {
  try {
    // 处理 base64 图片数据
    if (url.startsWith('data:image')) {
      const base64Data = url.split(',')[1];
      return Buffer.from(base64Data, 'base64');
    }

    // 处理URL图片
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error('Error getting image buffer:', error);
    return null;
  }
};

/**
 * 获取图片尺寸
 * @param buffer - 图片的二进制数据
 * @returns Promise<{width: number, height: number}> - 返回图片的宽高
 */
const getImageDimensions = async (buffer: Uint8Array): Promise<{width: number, height: number;}> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const blob = new Blob([buffer], {type: 'image/jpeg'});
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.width,
        height: img.height
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};

const processImage = async (imageUrl: string, workbook: ExcelJS.Workbook, colStart: number, colEnd: number, imageRow: number) => {
  try {
    console.log('开始处理图片:', {
      imageUrl,
      colStart,
      colEnd,
      imageRow
    });

    const imageBuffer = await getImageBuffer(imageUrl);
    if (!imageBuffer) {
      console.warn('获取图片数据失败');
      return null;
    }
    console.log('成功获取图片数据');

    // 获取图片实际尺寸
    const dimensions = await getImageDimensions(imageBuffer);
    console.log('图片原始尺寸:', dimensions);

    // 获取实际的设备 DPI
    const getDPI = () => {
      const div = document.createElement('div');
      div.style.width = '1in';
      div.style.height = '1in';
      div.style.position = 'absolute';
      div.style.left = '-100%';
      div.style.top = '-100%';
      document.body.appendChild(div);
      const dpi = div.offsetWidth;
      document.body.removeChild(div);
      return dpi;
    };

    // 获取实际 DPI
    const actualDPI = getDPI();
    console.log('实际设备 DPI:', actualDPI);

    // Excel单位换算关系（基于实际DPI）
    const INCH_TO_PIXEL = actualDPI;       // 1英寸 = 实际DPI像素
    const PIXELS_PER_COLUMN = Math.round(64 * (actualDPI / 96));   // 根据实际DPI调整列宽
    const PIXELS_PER_ROW = Math.round(20 * (actualDPI / 96));      // 根据实际DPI调整行高
    const CHAR_WIDTH_PIXELS = Math.round(8 * (actualDPI / 96));    // 根据实际DPI调整字符宽度
    const POINT_TO_PIXEL = 1.4 * (actualDPI / 96);     // 根据实际DPI调整点到像素的转换
    
    // Excel的列宽和行高设置
    const EXCEL_COLUMN_WIDTH = 30;    // B列的字符宽度
    const EXCEL_ROW_HEIGHT = 150;     // 行高（点数）
    
    // 计算单元格的实际像素尺寸
    const cellWidthPixels = EXCEL_COLUMN_WIDTH * CHAR_WIDTH_PIXELS;  // 列宽转换为像素
    const cellHeightPixels = EXCEL_ROW_HEIGHT * POINT_TO_PIXEL;     // 使用新的换算比例

    // 计算图片缩放比例，保持原始宽高比
    const imageAspectRatio = dimensions.width / dimensions.height;
    let targetWidth, targetHeight;

    // 定义接近1的范围（用于判断是否为正方形）
    const SQUARE_THRESHOLD = 0.05;  // 如果宽高比在0.95-1.05之间，认为是正方形
    const isSquare = Math.abs(imageAspectRatio - 1) < SQUARE_THRESHOLD;

    if (isSquare) {
      // 正方形图片：完全居中
      targetWidth = cellWidthPixels;
      targetHeight = cellHeightPixels;
    } else if (imageAspectRatio > 1) {
      // 宽图：以宽度为基准
      targetWidth = cellWidthPixels;
      targetHeight = targetWidth / imageAspectRatio;
    } else {
      // 竖图：以高度为基准
      targetHeight = cellHeightPixels;
      targetWidth = targetHeight * imageAspectRatio;
    }

    // 计算目标单元格B13的位置
    const targetCol = 1;  // B列
    const targetRow = 12; // 第13行

    // 计算水平偏移（考虑A列宽度）
    let horizontalOffset, verticalOffset;

    if (isSquare) {
      // 正方形图片：完全居中
      horizontalOffset = targetCol + (cellWidthPixels - targetWidth) / (2 * PIXELS_PER_COLUMN);
      verticalOffset = targetRow + (cellHeightPixels - targetHeight) / (2 * cellHeightPixels);
    } else if (imageAspectRatio > 1) {
      // 宽图：水平居中，垂直居中
      horizontalOffset = targetCol + (cellWidthPixels - targetWidth) / (2 * PIXELS_PER_COLUMN);
      verticalOffset = targetRow + 0.3;  // 减小垂直偏移，避免贴近下边框
    } else {
      // 竖图：需要更大的水平偏移
      horizontalOffset = targetCol + 0.99;  // 增加水平偏移，使图片更靠右
      verticalOffset = targetRow + (cellHeightPixels - targetHeight) / (2 * cellHeightPixels);
    }

    console.log('图片位置计算:', {
      imageType: isSquare ? '正方图' : imageAspectRatio > 1 ? '宽图' : '竖图',
      dpi: actualDPI,
      aspectRatio: imageAspectRatio,
      originalWidth: dimensions.width,
      originalHeight: dimensions.height,
      cellWidth: cellWidthPixels,
      cellHeight: cellHeightPixels,
      targetWidth,
      targetHeight,
      targetCol,
      targetRow,
      horizontalOffset,
      verticalOffset,
      cellHeightInRows: cellHeightPixels / PIXELS_PER_ROW
    });

    return {
      tl: {
        col: horizontalOffset,
        row: verticalOffset
      },
      ext: {
        width: targetWidth,
        height: targetHeight
      },
      editAs: 'oneCell'
    };
  } catch (error) {
    console.error('处理图片失败:', error);
    return null;
  }
};

export const exportQuotation = async (formData: QuotationData) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('报价单');

  // 设置列宽
  worksheet.columns = [
    {width: 5},    // A - No
    {width: 30},   // B - Image
    {width: 16},   // C - Supplier
    {width: 16},   // D - Supplier Item Code
    {width: 27},   // E - Specification Details
    {width: 13},   // F - Sample Lead Time
    {width: 11},   // G - Width
    {width: 11},   // H - Depth
    {width: 11},   // I - Height
    {width: 11},   // J - Box Width
    {width: 11},   // K - Box Depth
    {width: 11},   // L - Box Height
    {width: 8},    // M - N.W
    {width: 8},    // N - G.W
    {width: 11},   // O - Effective Vol
    {width: 11},   // P - Loading Qty
    {width: 8},    // Q - MOQ
    {width: 13},   // R - Price
    {width: 11},   // S - BIFMA
    {width: 16},   // T - 3D CAD
    {width: 16},   // U - All Product Data
    {width: 16}    // V - Product Images
  ];

  // 添加标题行
  const titleRow = worksheet.getRow(1);
  titleRow.height = 60;  // 调整高度
  const titleCell = titleRow.getCell(1);
  titleCell.value = 'TC QUOTATION FORM';
  titleCell.font = {
    name: 'Arial',
    size: 20,
    bold: true
  };
  titleCell.alignment = {
    vertical: 'middle',
    horizontal: 'center'
  };
  worksheet.mergeCells('A1:V1');  // 合并整行

  // 设置第1行合并单元格的上边框
  for (let col = 'A'; col <= 'V'; col = String.fromCharCode(col.charCodeAt(0) + 1)) {
    const cell = worksheet.getRow(1).getCell(col);
    cell.border = {
      ...cell.border,
      top: {style: 'thin'}
    };
  }

  // 添加 logo 到标题行右上角
  const logoBuffer = getBuffer(LOGO, 'base64');
  const logoId = workbook.addImage({
    buffer: logoBuffer,
    extension: 'jpeg',
  });

  // 单位转换常量
  const INCH_TO_PIXEL = 96;  // 1英寸 = 96像素
  const PIXELS_PER_COLUMN = 64;  // Excel 中每列的默认宽度（像素）
  const PIXELS_PER_ROW = 20;  // Excel 中每行的默认高度（像素）

  // 目标尺寸（英寸）
  const TARGET_WIDTH_INCHES = 2.0;   // 宽度2英寸
  const TARGET_HEIGHT_INCHES = 0.8;  // 高度0.8英寸
  const TARGET_LEFT_INCHES = 13.5;   // 左边距22英寸
  const TARGET_TOP_INCHES = 0.05;    // 上边距0.15英寸（修改为0.15英寸）

  // 转换为像素
  const targetWidth = TARGET_WIDTH_INCHES * INCH_TO_PIXEL;
  const targetHeight = TARGET_HEIGHT_INCHES * INCH_TO_PIXEL;
  const targetLeft = TARGET_LEFT_INCHES * INCH_TO_PIXEL;
  const targetTop = TARGET_TOP_INCHES * INCH_TO_PIXEL;

  // 计算列和行的位置
  const colStart = targetLeft / PIXELS_PER_COLUMN;
  const rowStart = targetTop / PIXELS_PER_ROW;

  // 添加图片
  worksheet.addImage(logoId, {
    tl: {
      col: colStart,
      row: rowStart
    },
    ext: {
      width: targetWidth,
      height: targetHeight
    }
  } as ImagePosition);

  // 添加标题行边框
  for (let i = 1; i <= 22; i++) {  // 给所有列添加边框
    const cell = titleRow.getCell(i);
    cell.border = {
      top: {style: 'thin'},
      left: {style: 'thin'},
      bottom: {style: 'thin'},
      right: {style: 'thin'}
    };
  }

  // 添加 Notice 行
  const noticeRow = worksheet.getRow(2);
  noticeRow.height = 32;
  const noticeCell = noticeRow.getCell(1);
  noticeCell.value = 'Notice: Please follow below TC product standards and fill all necessary information into the form.';
  noticeCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: {argb: 'FFFF0000'}  // 纯红色背景
  };
  noticeCell.font = {
    name: 'Arial',
    size: 14,
    color: {argb: 'FFFFFFFF'}  // 白色文字
  };
  noticeCell.alignment = {
    vertical: 'middle',
    horizontal: 'left',
    indent: 1  // 添加左侧缩进
  };
  worksheet.mergeCells('A2:V2');

  // 添加 TC STANDARD 部分
  const tcStandardRow = worksheet.getRow(3);
  tcStandardRow.height = 30;
  const tcStandardCell = tcStandardRow.getCell(1);
  tcStandardCell.value = 'TC STANDARD:';
  tcStandardCell.font = {
    name: 'Arial',
    size: 14,
    bold: true,
    color: {argb: 'FFFF0000'}  // 红色文字
  };
  tcStandardCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: {argb: 'FFF4FECD'}  // 浅黄色背景
  };
  tcStandardCell.alignment = {
    vertical: 'middle',
    horizontal: 'left',
    indent: 1  // 添加左侧缩进
  };
  worksheet.mergeCells('A3:V3');

  // 设置 TC STANDARD 内容
  const standardContents = [
    ['Fabric /Linings of fabric: UKFR - BS5852 Crib 5, Med Hazard', 'Seat foam: UKFR - BS5852, 30kg/m3, 70LBS Non-powder sponge', 'Star base: BIFMA category A'],
    ['Mesh for seat:UKFR - BS5852 Crib 5, Med Hazard', 'Back foam: UKFR - BS5852, 24kg/m3,70LBS Non-powder sponge', 'Gas lift: Class#4'],
    ['Mesh for back:California fire protection - CA117', 'Armrest: BIFMA category A', 'Carton: 250LBS or K=K cardboard']
  ];

  // 设置内容行
  standardContents.forEach((rowData, rowIndex) => {
    const currentRow = rowIndex + 4;
    const row = worksheet.getRow(currentRow);
    row.height = 30;

    // 设置背景色和边框
    for (let col = 1; col <= 22; col++) {
      const cell = row.getCell(col);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'FFF4FECD'}  // 浅黄色背景
      };
      cell.border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
      };
    }

    // 设置内容
    const ranges = ['A:E', 'F:M', 'N:V'];
    rowData.forEach((text, colIndex) => {
      const [startCol, endCol] = ranges[colIndex].split(':');
      const cell = row.getCell(startCol);
      cell.value = text;
      cell.font = {
        name: 'Arial',
        size: 12
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'left',
        indent: 1  // 添加左侧缩进
      };
      worksheet.mergeCells(`${startCol}${currentRow}:${endCol}${currentRow}`);
    });
  });

  // 添加外边框和分隔线
  for (let row = 3; row <= 6; row++) {
    for (let col = 1; col <= 20; col++) {
      const cell = worksheet.getRow(row).getCell(col);
      const border: any = {};

      if (row === 3) border.top = {style: 'thin'};
      if (row === 6) border.bottom = {style: 'thin'};
      if (col === 1) border.left = {style: 'thin'};
      if (col === 20) border.right = {style: 'thin'};
      if (col === 6 || col === 14) border.left = {style: 'thin'};

      cell.border = border;
    }
  }

  // 添加基本信息
  // 添加上方空行
  const emptyRow1 = worksheet.getRow(7);
  emptyRow1.height = 30;

  // 设置第7-10行的V列右边框
  for (let row = 7; row <= 10; row++) {
    const cell = worksheet.getRow(row).getCell('V');
    cell.border = {
      ...cell.border,
      right: {style: 'thin'}
    };
  }

  // 设置A列1-13行的左边框
  for (let row = 1; row <= 13; row++) {
    const cell = worksheet.getRow(row).getCell('A');
    cell.border = {
      ...cell.border,
      left: {style: 'thin'}
    };
  }

  const basicInfo = [
    [
      {label: 'Supplier:', value: formData.supplier || '', labelRange: 'A:B', valueRange: 'C:D'},
      {label: 'Date:', value: formData.quote_date || '', labelRange: 'E', valueRange: 'F:H'},
      {label: 'port:', value: formData.port || '', labelRange: 'I', valueRange: 'J:K'}
    ],
    [
      {label: 'Sales contacts:', value: formData.sales_contacts || '', labelRange: 'A:B', valueRange: 'C:D'},
      {label: 'Valid period:', value: formData.valid_period || '', labelRange: 'E', valueRange: 'F:H'},
      {label: 'remark:', value: formData.remark || '', labelRange: 'I', valueRange: 'J:K'}
    ]
  ];

  // 设置基本信息
  basicInfo.forEach((rowData, rowIndex) => {
    const currentRow = rowIndex + 8;
    const row = worksheet.getRow(currentRow);
    row.height = 30;

    rowData.forEach((item) => {
      // 设置标签
      const [labelStartCol, labelEndCol] = item.labelRange.split(':');
      const labelCell = row.getCell(labelStartCol);
      labelCell.value = item.label;
      labelCell.font = {
        name: 'Arial',
        size: 14,
        bold: true
      };
      labelCell.alignment = {
        vertical: 'middle',
        horizontal: 'left'
      };
      // 只有当有结束列时才合并单元格
      if (labelEndCol) {
        try {
          worksheet.mergeCells(`${labelStartCol}${currentRow}:${labelEndCol}${currentRow}`);
        } catch (error) {
          console.warn('Warning: Could not merge label cells', error);
        }
      }

      // 设置值
      const [valueStartCol, valueEndCol] = item.valueRange.split(':');
      const valueCell = row.getCell(valueStartCol);
      valueCell.value = item.value;
      valueCell.font = {
        name: 'Arial',
        size: 14
      };
      valueCell.alignment = {
        vertical: 'middle',
        horizontal: 'left'
      };

      // 只有当有结束列时才合并单元格
      if (valueEndCol) {
        try {
          worksheet.mergeCells(`${valueStartCol}${currentRow}:${valueEndCol}${currentRow}`);
        } catch (error) {
          console.warn('Warning: Could not merge value cells', error);
        }
      }

      // 设置所有单元格的边框
      const range = labelEndCol ?
        [labelStartCol, labelEndCol] :
        [labelStartCol];
      const valueRange = valueEndCol ?
        [valueStartCol, valueEndCol] :
        [valueStartCol];

      [...range, ...valueRange].forEach(col => {
        const cell = row.getCell(col);
        cell.border = {
          top: {style: 'thin'},
          left: {style: 'thin'},
          bottom: {style: 'thin'},
          right: {style: 'thin'}
        };
      });
    });
  });

  // 添加下方空行
  const emptyRow2 = worksheet.getRow(10);
  emptyRow2.height = 30;

  // 添加表头（移到第11行）
  const headerRow = worksheet.getRow(11);
  headerRow.height = 30;

  // 定义表头分组（需要合并上下行的列）
  const headerGroups = [
    {text: 'No', start: 'A', end: 'A', mergeRows: true},
    {text: 'Image', start: 'B', end: 'B', mergeRows: true},
    {text: 'Supplier', start: 'C', end: 'C', mergeRows: true},
    {text: 'Supplier\nitem Code', start: 'D', end: 'D', mergeRows: true},
    {text: 'Specification Details', start: 'E', end: 'E', mergeRows: true},
    {text: 'Sample\nLead Time', start: 'F', end: 'F', mergeRows: true},
    {text: 'Overall Product Dimensions\n(mm)', start: 'G', end: 'I', mergeRows: false},
    {text: 'Box Dimensions (mm)', start: 'J', end: 'L', mergeRows: false},
    {text: 'Box Weight (KG)', start: 'M', end: 'N', mergeRows: false},
    {text: 'Effective\nVol', start: 'O', end: 'O', mergeRows: true},
    {text: 'Loading\nQty\n40HQ', start: 'P', end: 'P', mergeRows: true},
    {text: 'MOQ', start: 'Q', end: 'Q', mergeRows: true},
    {text: 'Supplier\nCost Price', start: 'R', end: 'R', mergeRows: true},
    {text: 'BIFMA\ntested (Yes\n/ No)', start: 'S', end: 'S', mergeRows: true},
    {text: '3D CAD Block\nAvailable (Yes\n/ No)', start: 'T', end: 'T', mergeRows: true},
    {text: 'All Product\nData Available\n(Yes / No)', start: 'U', end: 'U', mergeRows: true},
    {text: 'Product\nImages\nAvailable\n(Yes / No)', start: 'V', end: 'V', mergeRows: true}
  ];

  // 设置表头
  headerGroups.forEach(group => {
    const cell = headerRow.getCell(group.start);
    cell.value = group.text;
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FF8DB4E2'}  // 浅蓝色背景
    };
    cell.font = {
      name: 'Arial',
      size: 11,
      bold: true,
      color: {argb: 'FF000000'}  // 黑色文字
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true
    };
    cell.border = {
      top: {style: 'thin'},
      left: {style: 'thin'},
      bottom: {style: 'thin'},
      right: {style: 'thin'}
    };

    // 如果需要合并列
    if (group.start !== group.end) {
      worksheet.mergeCells(`${group.start}11:${group.end}11`);
    }

    // 如果需要合并行
    if (group.mergeRows) {
      worksheet.mergeCells(`${group.start}11:${group.end}12`);
    }
  });

  // 添加子表头
  const subHeaderRow = worksheet.getRow(12);
  subHeaderRow.height = 30;

  const subHeaders = [
    {text: 'Width\n(mm)', col: 'G'},
    {text: 'Depth\n(mm)', col: 'H'},
    {text: 'Height\n(mm)', col: 'I'},
    {text: 'Width\n(mm)', col: 'J'},
    {text: 'Depth\n(mm)', col: 'K'},
    {text: 'Height\n(mm)', col: 'L'},
    {text: 'N.W', col: 'M'},
    {text: 'G.W', col: 'N'}
  ];

  // 设置子表头
  subHeaders.forEach(header => {
    const cell = subHeaderRow.getCell(header.col);
    cell.value = header.text;
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FF8DB4E2'}  // 浅蓝色背景
    };
    cell.font = {
      name: 'Arial',
      size: 11,
      bold: true,
      color: {argb: 'FF000000'}  // 黑色文字
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true
    };
    cell.border = {
      top: {style: 'thin'},
      left: {style: 'thin'},
      bottom: {style: 'thin'},
      right: {style: 'thin'}
    };
  });

  // 添加数据行（移到第13行）
  const dataRow = worksheet.getRow(13);
  dataRow.height = 150;  // 调整行高为合适的高度

  // 设置数据行的样式
  for (let i = 1; i <= 22; i++) {  // 遍历所有列
    const cell = dataRow.getCell(i);
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true
    };
    cell.border = {
      top: {style: 'thin'},
      left: {style: 'thin'},
      bottom: {style: 'thin'},
      right: {style: 'thin'}
    };
    cell.font = {
      name: 'Arial',
      size: 11
    };
  }

  // 设置数据
  const dataMapping = [
    {col: 'A', value: 1}, // No.
    {
      col: 'B', value: async () => {
        if (formData.image) {
          try {
            // 使用我们自己的 processImage 函数处理图片，从 B 列开始（列号 2）
            const imagePosition = await processImage(formData.image, workbook, 2, 2, 13);
            if (!imagePosition) {
              console.warn('图片处理失败');
              return 'Image processing failed';
            }

            // 设置B13单元格的高度和样式
            const cell = worksheet.getCell('B13');
            worksheet.getRow(13).height = 120;
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'center'
            };

            // 将图片添加到工作表
            const imageBuffer = await getImageBuffer(formData.image);
            if (!imageBuffer) {
              return 'Image loading failed';
            }

            const imageId = workbook.addImage({
              buffer: getBuffer(imageBuffer),
              extension: 'jpeg'
            });

            // 使用 processImage 计算的位置添加图片
            worksheet.addImage(imageId, imagePosition);

            return '';  // 单元格本身不显示内容
          } catch (error) {
            console.error('Error processing image:', error);
            return 'Image processing failed';
          }
        }
        return '';
      }
    },
    {col: 'C', value: formData.supplier},
    {col: 'D', value: formData.supplier_item_code},
    {col: 'E', value: formData.specification_details},
    {col: 'F', value: formData.sample_lead_time},
    {col: 'G', value: formData.overall_dimensions_width},
    {col: 'H', value: formData.overall_dimensions_depth},
    {col: 'I', value: formData.overall_dimensions_height},
    {col: 'J', value: formData.box_dimensions_width},
    {col: 'K', value: formData.box_dimensions_depth},
    {col: 'L', value: formData.box_dimensions_height},
    {col: 'M', value: formData.box_weight_net_weighth},
    {col: 'N', value: formData.net_weight_gross_weight},
    {col: 'O', value: formData.effective_vol},
    {col: 'P', value: formData.loading_qty},
    {col: 'Q', value: formData.moq},
    {col: 'R', value: formData.fob_price},
    {col: 'S', value: formData.bifma_tested ? 'Yes' : 'No'},
    {col: 'T', value: formData.cad_block_available ? 'Yes' : 'No'},
    {col: 'U', value: formData.product_data_available ? 'Yes' : 'No'},
    {col: 'V', value: formData.product_images_available ? 'Yes' : 'No'}
  ];

  // 设置每个单元格的值
  for (const {col, value} of dataMapping) {
    const cell = dataRow.getCell(col);
    cell.value = typeof value === 'function' ? await value() : value || '';
  }

  // 设置打印区域和打印选项
  worksheet.pageSetup.printArea = 'A1:V13';  // 设置打印区域
  worksheet.pageSetup.paperSize = 9;         // 9 表示 A4 纸
  worksheet.pageSetup.orientation = 'landscape';  // 横向打印
  worksheet.pageSetup.fitToPage = true;      // 适应页面
  worksheet.pageSetup.fitToWidth = 1;        // 宽度适应1页
  worksheet.pageSetup.fitToHeight = 1;       // 高度适应1页
  worksheet.pageSetup.margins = {           // 设置页边距（单位：英寸）
    left: 0.25,
    right: 0.25,
    top: 0.25,
    bottom: 0.25,
    header: 0,
    footer: 0
  };

  // 返回buffer而不是直接下载
  return await workbook.xlsx.writeBuffer();
};