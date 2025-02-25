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

// 页眉表格宽度配置（与正文表格保持一致的比例）
const HEADER_TABLE_WIDTHS = {
  LOGO: 2256,        // Logo 列宽度 (25%)
  TITLE: 4964,       // 标题列宽度 (55%)
  CODE: 1806         // 代码列宽度 (20%)
}

// 两列表格的宽度配置
// ... existing code ...
