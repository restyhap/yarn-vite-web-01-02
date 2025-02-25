import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, AlignmentType, HeadingLevel, BorderStyle } from 'docx'
import { saveAs } from 'file-saver'

interface FormData {
  [key: string]: any
}

// 创建表格行
const createTableRow = (label: string, value: string | undefined, hasShading = true) => {
  return new TableRow({
    children: [
      new TableCell({
        width: {
          size: 30,
          type: 'pct',
        },
        children: [new Paragraph(label)],
        shading: hasShading ? { fill: 'F0F0F0' } : undefined
      }),
      new TableCell({
        children: [new Paragraph(value || '')]
      }),
    ],
  })
}

// 创建表格标题
const createSectionTitle = (title: string) => {
  return new Paragraph({
    text: title,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 }
  })
}

// 创建表格
const createTable = (rows: TableRow[], tableWidth: number = 100) => {
  return new Table({
    width: {
      size: tableWidth,
      type: 'pct',
    },
    alignment: AlignmentType.CENTER,
    rows
  })
}

// 创建合并单元格的表格行
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
        columnSpan: colSpan
      }),
      ...(colSpan === 1 ? [new TableCell({
        children: [new Paragraph(value || '')]
      })] : [])
    ],
  })
}

// 导出Word文档
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
            text: "ALL MEASUREMENTS ARE TO BE IN MILLIMETRE'S (MM) AND WEIGHTS IN KILOGRAMS (KG)",
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            text: "All Details to be completed fully",
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 400 }
          }),
          // 所有其他表格合并在一个大表格中
          createTable([
            // UPHOLSTERY 部分
            createMergedTableRow('UPHOLSTERY', '', true, 2),
            createTableRow('FABRIC MANUFACTURER', formData.upholstery?.fabric_manufacturer),
            createTableRow('COLOUR CODE', formData.upholstery?.colour_code),
            createTableRow('LEATHER GRADE (WHERE APPLICABLE)', formData.upholstery?.leather_grade),
            createTableRow('USAGE PER CHAIR（BACK/SEAT）', formData.upholstery?.usage_per_chair),

            // CARTON 部分
            createMergedTableRow('CARTON', '', true, 2),
            createMergedTableRow('(MINIMUM TWIN WALLED CARDBOARD WITH DIVIDERS)', '', true, 2),
            createTableRow('DIMENSIONS - WIDTH', formData.packaging?.carton_width),
            createTableRow('DIMENSIONS - DEPTH', formData.packaging?.carton_depth),
            createTableRow('DIMENSIONS - HEIGHT', formData.packaging?.carton_height),
            createTableRow('BOARD TYPE', formData.packaging?.board_type),
            createTableRow('Items per carton', formData.packaging?.items_per_carton),
            createTableRow('CARTON VOLUME (m³)', formData.packaging?.carton_volume),

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
          ])
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
