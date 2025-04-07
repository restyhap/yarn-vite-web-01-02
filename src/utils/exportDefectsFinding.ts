/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-04-06 21:16:24
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-04-07 17:19:40
 * @FilePath: /yarn-vite-web-01-02/src/utils/exportDefectsFinding.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import ExcelJS from 'exceljs'
import type { ImagePosition } from 'exceljs'
import { ALERT_ICON } from './excelUtils'
import { getImageBuffer, getImageDimensions } from './exportQCReport'

interface QCReportDefect {
  defectTitle: string
  defectDescription: string
  improvementSuggestion: string
  inspector: string
  images: string[]
}

// 在文件开始部分定义类型
type DefectsType = QCReportDefect;

// 处理图片并返回图片配置
const processImage = async (imageUrl: string, workbook: ExcelJS.Workbook, colStart: number, colEnd: number, imageRow: number) => {
  const imageBuffer = await getImageBuffer(imageUrl)
  if (!imageBuffer) return null

  try {
    const imageId = workbook.addImage({
      buffer: imageBuffer as unknown as any,
      extension: 'jpeg'
    })

    // 获取图片实际尺寸
    const dimensions = await getImageDimensions(imageBuffer)
    
    // 单位转换常量
    const INCH_TO_PIXEL = 96        // 1英寸 = 96像素
    const PIXELS_PER_COLUMN = 64    // Excel 中每列的默认宽度（像素）
    const PIXELS_PER_ROW = 20       // Excel 中每行的默认高度（像素）
    const MAX_SIZE_INCHES = 2.92    // 最大尺寸2.92英寸
    const FRAME_WIDTH_INCHES = 2.98  // 图片框宽度2.98英寸
    const FRAME_HEIGHT_INCHES = 3.04 // 图片框高度3.04英寸

    // 计算图片的宽高比
    const imageAspectRatio = dimensions.width / dimensions.height

    // 计算最终尺寸（考虑最大值限制）
    let finalWidth: number
    let finalHeight: number

    if (imageAspectRatio > 1) {
      // 宽图：以宽度为基准
      finalWidth = MAX_SIZE_INCHES * INCH_TO_PIXEL
      finalHeight = finalWidth / imageAspectRatio
    } else {
      // 高图：以高度为基准
      finalHeight = MAX_SIZE_INCHES * INCH_TO_PIXEL
      finalWidth = finalHeight * imageAspectRatio
    }

    // 计算图片框的总宽度（以像素为单位）
    const frameWidthColumns = colEnd - colStart + 1  // 总列数
    const frameWidthPixels = frameWidthColumns * PIXELS_PER_COLUMN

    // 计算水平居中的偏移量
    const horizontalOffset = (frameWidthPixels - finalWidth) / (2 * PIXELS_PER_COLUMN)

    // 计算垂直居中的偏移量（转换为Excel行单位）
    const frameHeightPixels = FRAME_HEIGHT_INCHES * INCH_TO_PIXEL
    const verticalOffsetPixels = (frameHeightPixels - finalHeight) / 2
    const verticalOffset = verticalOffsetPixels / PIXELS_PER_ROW

    // 返回图片配置
    return {
      imageId,
      position: {
        tl: { 
          col: colStart - 1 + horizontalOffset,  // 从起始列开始，加上水平偏移
          row: imageRow - 1 + verticalOffset  // 行位置加上垂直偏移
        },
        ext: { 
          width: finalWidth,
          height: finalHeight
        }
      } as ImagePosition
    }
  } catch (error) {
    console.warn(`处理图片失败: ${imageUrl}`, error)
    return null
  }
}

// 添加单个缺陷问题的函数
const addDefectSection = async (
  worksheet: ExcelJS.Worksheet,
  defect: QCReportDefect,
  alertImageId: number,
  workbook: ExcelJS.Workbook,
  isFirstSection: boolean, // 是第一个区域还是第二个区域
  pageStartRow: number = 1 // 当前页面的起始行号
) => {
  // 根据是否是第一个区域和页面起始行来确定行范围
  let titleRow, titleEndRow, imageStartRow, imageEndRow, emptyRow1, descStartRow, descEndRow, emptyRow2;

  if (isFirstSection) {
    // 第一个区域（当前页面上半部分）
    titleRow = pageStartRow + 3; // 标题行（第4行，相对于页面起始位置）
    titleEndRow = pageStartRow + 4; // 标题结束行（第5行）
    // 第6行为空
    imageStartRow = pageStartRow + 6; // 图片起始行（第7行）
    imageEndRow = pageStartRow + 16; // 图片结束行（第17行）
    emptyRow1 = pageStartRow + 17; // 第一个空行（第18行）
    descStartRow = pageStartRow + 18; // 描述起始行（第19行）
    descEndRow = pageStartRow + 20; // 描述结束行（第21行）
    emptyRow2 = pageStartRow + 21; // 第二个空行（第22行）
  } else {
    // 第二个区域（当前页面下半部分）
    // 第23-24行为空
    titleRow = pageStartRow + 22; // 空行（第23行）
    titleEndRow = pageStartRow + 23; // 空行（第24行）
    imageStartRow = pageStartRow + 24; // 图片起始行（第25行）
    imageEndRow = pageStartRow + 34; // 图片结束行（第35行）
    emptyRow1 = pageStartRow + 35; // 空行（第36行）
    descStartRow = pageStartRow + 36; // 描述起始行（第37行）
    descEndRow = pageStartRow + 38; // 描述结束行（第39行）
    emptyRow2 = pageStartRow + 39; // 页脚行（第40行）
  }

  // 确保有足够的行
  while (worksheet.rowCount < emptyRow2) {
    worksheet.addRow(['']);
  }

  // 设置所有行的统一高度
  for (let row = titleRow; row <= emptyRow2; row++) {
    worksheet.getRow(row).height = 15;
  }

  // 只有第一个区域需要添加标题和图标
  if (isFirstSection) {
    // 添加标题 - 使用D:E放警告图标，F:P放标题
    // 设置标题文本
    const titleCell = worksheet.getCell(`F${titleRow}`);
    titleCell.value = `Title (${defect.defectTitle}):`;
    titleCell.font = { name: 'Arial', size: 18, bold: true };
    titleCell.alignment = {
      vertical: 'middle',
      horizontal: 'left' // 文字居左
    };
    // 合并标题单元格 F:P 跨两行
    worksheet.mergeCells(`F${titleRow}:P${titleEndRow}`);

  // 计算警告图标的尺寸
    const INCH_TO_PIXEL = 96;  // 1英寸 = 96像素
    const iconWidth = 0.9 * INCH_TO_PIXEL;
    const iconHeight = 0.63 * INCH_TO_PIXEL;

    // 添加警告图标到D-E列
    worksheet.addImage(alertImageId, {
      tl: { 
        col: 3,  // D列
        row: titleRow - 1  // 标题行
      },
      ext: { 
        width: iconWidth,
        height: iconHeight
      }
    });

    // 合并D:E列的图标区域
    worksheet.mergeCells(`D${titleRow}:E${titleEndRow}`);

    // 设置D和E列单元格居中对齐
    const iconCell = worksheet.getCell(`D${titleRow}`);
    iconCell.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };
  }

  // 设置图片区域的边框和背景样式
  const redBorderStyle = { style: 'medium' as const, color: { argb: 'FFFF0000' } };
  const blueBorderStyle = { style: 'medium' as const, color: { argb: 'FF0000FF' } };
  const whiteFill = {
    type: 'pattern' as const,
    pattern: 'solid' as const,
    fgColor: { argb: 'FFFFFFFF' }
  };

  // 设置第一个图片区域边框（D-I列）
  const colStart1 = 4;  // D列
  const colEnd1 = 9;    // I列
  
  // 添加图片框边框
  for (let row = imageStartRow; row <= imageEndRow; row++) {
    for (let col = colStart1; col <= colEnd1; col++) {
      const cell = worksheet.getCell(row, col);
      
      // 设置边框
      if (row === imageStartRow) {
        cell.border = { ...cell.border, top: redBorderStyle };
      }
      if (row === imageEndRow) {
        cell.border = { ...cell.border, bottom: redBorderStyle };
      }
      if (col === colStart1) {
        cell.border = { ...cell.border, left: redBorderStyle };
      }
      if (col === colEnd1) {
        cell.border = { ...cell.border, right: redBorderStyle };
      }
    }
  }

  // 设置第二个图片区域边框（K-P列）
  const colStart2 = 11;  // K列
  const colEnd2 = 16;    // P列
  
  // 添加图片框边框
  for (let row = imageStartRow; row <= imageEndRow; row++) {
    for (let col = colStart2; col <= colEnd2; col++) {
      const cell = worksheet.getCell(row, col);
    
    // 设置边框
      if (row === imageStartRow) {
        cell.border = { ...cell.border, top: redBorderStyle };
      }
      if (row === imageEndRow) {
        cell.border = { ...cell.border, bottom: redBorderStyle };
      }
      if (col === colStart2) {
        cell.border = { ...cell.border, left: redBorderStyle };
      }
      if (col === colEnd2) {
        cell.border = { ...cell.border, right: redBorderStyle };
      }
    }
  }

  // 添加描述区域
  // 合并D到P列的描述区域
  worksheet.mergeCells(`D${descStartRow}:P${descEndRow}`);

  // 设置描述单元格的样式
  const descriptionCell = worksheet.getCell(`D${descStartRow}`);
  descriptionCell.value = defect.defectDescription || ''; // 确保有值，避免undefined
  descriptionCell.fill = whiteFill;
  descriptionCell.alignment = {
    vertical: 'top',
    horizontal: 'left',
    wrapText: true,
    indent: 1
  };

  // 设置描述单元格的边框
  descriptionCell.border = {
    top: blueBorderStyle,
    left: blueBorderStyle,
    bottom: blueBorderStyle,
    right: blueBorderStyle
  };

  // 添加图片
  if (defect.images && defect.images.length > 0) {
    // 添加第一张图片
    const processedImage1 = await processImage(defect.images[0], workbook, colStart1, colEnd1, imageStartRow);
    if (processedImage1) {
      worksheet.addImage(processedImage1.imageId, processedImage1.position);
    }

    // 如果有第二张图片，添加第二张图片
    if (defect.images.length > 1) {
      const processedImage2 = await processImage(defect.images[1], workbook, colStart2, colEnd2, imageStartRow);
      if (processedImage2) {
        worksheet.addImage(processedImage2.imageId, processedImage2.position);
      }
    }
  }

  // 返回最后一行的行号
  return emptyRow2;
};

export const exportDefectsFinding = async (
  workbook: ExcelJS.Workbook,
  defects: DefectsType[]
): Promise<boolean> => {
  try {
    console.log('创建缺陷发现工作表...');
    const defectsWorksheet = workbook.addWorksheet('Defects Finding', {
      pageSetup: {
        paperSize: 9, // A4 纸
        orientation: 'portrait',
        fitToPage: true, // 更改为true，使内容适合页面
        scale: 100,
        horizontalCentered: true,
        verticalCentered: true,
        // 设置打印区域为C列到Q列，排除A和B列
        // 明确限制打印区域到实际内容范围
        margins: {
          left: 0.15, // 减少左边距
          right: 0.15, // 减少右边距
          top: 0.25,
          bottom: 0.25,
          header: 0,
          footer: 0
        },
        firstPageNumber: 1, // 第一页页码
      },
      properties: {
        defaultRowHeight: 15,
        defaultColWidth: 6,
        outlineLevelRow: 0,
        outlineLevelCol: 0,
        showGridLines: false
      }
    });

    // 设置列宽 - 使列宽与exportQCReport.ts保持一致
    // A-B列不需要打印，可以设置为较小的值
    for (let col = 1; col <= 2; col++) {
      defectsWorksheet.getColumn(col).width = 2; // 减小A-B列宽度，因为不会打印
    }
    
    // C列宽度设为3（与exportQCReport.ts一致）
    defectsWorksheet.getColumn('C').width = 3;
    
    // D列到P列的宽度设为6（与exportQCReport.ts一致）
    for (let col = 4; col <= 16; col++) {
      defectsWorksheet.getColumn(col).width = 6; // 使用与exportQCReport.ts相同的宽度
    }
    
    // Q列宽度设为3（与exportQCReport.ts一致）
    defectsWorksheet.getColumn('Q').width = 3;
    
    // R-Z列宽度设置
    for (let col = 18; col <= 26; col++) {
      defectsWorksheet.getColumn(col).width = 3; // 减小宽度
    }
    
    // 计算总页数（根据缺陷数量）
    const totalPages = Math.ceil(defects.length / 2);
    console.log(`总页数: ${totalPages}, 总缺陷数: ${defects.length}`);
    
    // 创建足够的行（每页40行）
    const totalRows = totalPages * 40;
    for (let i = 0; i < totalRows; i++) {
      defectsWorksheet.addRow(['']);
    }
    
    // 设置所有行的统一高度
    for (let i = 1; i <= totalRows; i++) {
      defectsWorksheet.getRow(i).height = 15;
    }

    // 定义边框样式
    const blueBorderStyle = { style: 'medium' as const, color: { argb: 'FF0000FF' } };
    const redBorderStyle = { style: 'medium' as const, color: { argb: 'FFFF0000' } };

    // 处理警告图标的加载
    const alertImageBuffer = await getImageBuffer(ALERT_ICON);
    if (!alertImageBuffer) {
      console.warn('警告图标加载失败');
      return false;
    }

    const alertImageId = workbook.addImage({
      buffer: alertImageBuffer as unknown as any,
      extension: 'png',
    });

    // 为每页设置页面布局和缺陷内容
    for (let page = 0; page < totalPages; page++) {
      console.log(`处理第 ${page + 1} 页...`);
      
      // 计算当前页的起始行和结束行
      const pageStartRow = page * 40 + 1;
      const pageEndRow = (page + 1) * 40;
      
      // 设置每页的标题（第2行和第3行合并）
      const headerCell = defectsWorksheet.getCell(`D${pageStartRow + 1}`); // 第2行（相对于页面起始位置）
      headerCell.value = 'Defects Finding';
      headerCell.font = { 
          name: 'Arial', 
          size: 24,
          bold: true 
      };
      headerCell.alignment = {
          vertical: 'middle',
        horizontal: 'left' // 文字居左
      };
      defectsWorksheet.mergeCells(`D${pageStartRow + 1}:P${pageStartRow + 2}`); // 合并第2-3行

      // 设置页面的蓝色外边框（完整的边框从第2行到第40行）
      // 上边框（每页的第2行）
      for (let col = 3; col <= 17; col++) {
        const topCell = defectsWorksheet.getCell(pageStartRow + 1, col); // 第2行
        topCell.border = {
          ...topCell.border,
            top: blueBorderStyle
        };
        
        // 下边框（每页的第40行）
        const bottomCell = defectsWorksheet.getCell(pageEndRow, col); // 第40行
        bottomCell.border = {
          ...bottomCell.border,
          bottom: blueBorderStyle
        };
      }
      
      // 左右边框（从第2行到第40行）
      for (let row = pageStartRow + 1; row <= pageEndRow; row++) {
        // C列的左边框
        const leftCell = defectsWorksheet.getCell(row, 3);
        leftCell.border = {
          ...leftCell.border,
          left: blueBorderStyle
        };

        // Q列的右边框
        const rightCell = defectsWorksheet.getCell(row, 17);
        rightCell.border = {
          ...rightCell.border,
          right: blueBorderStyle
        };
      }

      // 计算当前页应显示的缺陷索引
      const defectIndex1 = page * 2;
      const defectIndex2 = page * 2 + 1;

      // 添加第一个缺陷（如果存在）
      if (defectIndex1 < defects.length) {
        console.log(`添加第 ${defectIndex1 + 1} 个缺陷到第 ${page + 1} 页的上半部分`);
        await addDefectSection(defectsWorksheet, defects[defectIndex1], alertImageId, workbook, true, pageStartRow);
      }
      
      // 添加第二个缺陷（如果存在）
      if (defectIndex2 < defects.length) {
        console.log(`添加第 ${defectIndex2 + 1} 个缺陷到第 ${page + 1} 页的下半部分`);
        await addDefectSection(defectsWorksheet, defects[defectIndex2], alertImageId, workbook, false, pageStartRow);
      }

      // 添加页脚（每页的第40行）
      const footerCell = defectsWorksheet.getCell(`P${pageEndRow}`); // 第40行
      footerCell.value = `Page ${page + 1}`;
      footerCell.font = { name: 'Arial', size: 10 };
      footerCell.alignment = { vertical: 'middle', horizontal: 'right' };
    }

    // 添加分页符（每40行一页）
    for (let page = 0; page < totalPages - 1; page++) {
      const pageBreakRow = (page + 1) * 40;
      
      // 添加分页符
      defectsWorksheet.getRow(pageBreakRow).addPageBreak();
    }

    // 关键修复：明确设置打印区域到具体行数，确保只打印实际内容
    // 计算实际内容的结束行（最后一页的第40行）
    const lastContentRow = totalPages * 40;
    // 设置精确的打印区域
    defectsWorksheet.pageSetup.printArea = `C1:Q${lastContentRow}`;
    
    // 调整打印设置以优化页面布局
    defectsWorksheet.pageSetup.fitToPage = true; // 改为true，使内容适合页面
    defectsWorksheet.pageSetup.fitToWidth = 1; // 确保内容宽度适合一页
    defectsWorksheet.pageSetup.fitToHeight = totalPages; // 明确设置高度为总页数
    defectsWorksheet.pageSetup.scale = 100; // 保持100%的比例，不缩放

    // 移除所有后续行，避免Excel自动打印空白页
    // 这是一个关键步骤，确保没有超出内容范围的行被包含
    for (let row = lastContentRow + 1; row <= defectsWorksheet.rowCount; row++) {
      if (defectsWorksheet.getRow(row)) {
        defectsWorksheet.spliceRows(row, 1);
      }
    }

    // 确保工作表中的所有内容会被打印，不管有多少页
    // 设置适当的打印属性
  defectsWorksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
        if (!cell.value) return;
      
      // 设置默认字体
        cell.font = cell.font || { name: 'Arial', size: 11 };
      
      // 设置对齐方式
        cell.alignment = cell.alignment || { 
        vertical: 'middle', 
        horizontal: 'left',
        wrapText: true
        };
      
      // 设置白色背景
        cell.fill = cell.fill || {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' }
        };
      });
    });

    return true;
  } catch (error) {
    console.error('导出缺陷发现工作表失败:', error);
    return false;
  }
};

// 添加别名导出，使 exportQCReport.ts 能够正确导入
export const createDefectsFindingSheet = exportDefectsFinding;
