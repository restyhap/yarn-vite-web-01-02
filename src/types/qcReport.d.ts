export interface QcReportsDTO {
  qcReports: {
    id: string
    modelCode: string
    factoryCode: string
    supplier: string
    client: string
    poNumber: string
    inspectionDate: Date | null
    orderQty: number
    reportDate: Date | null
    inspectQty: number
    qcOfficer: string
    passFail: 'Pass' | 'Fail'
    secondQcDate: Date | null
    comments: string
    
    // 修改图片字段为单个字符串
    stocksInWarehouse: string
    samplingOfProductsQuantity: string
    shippingMarks: string
    barcode: string
    packingOutside: string
    packingInside: string
    chairComponentsPacked: string
    chairComponentsUnpacked: string
    fittingPackPacked: string
    fittingPackUnpacked: string
    productionLabel: string
    assemblyInstructions: string
    imageOfComponentsSeat: string
    imageOfComponentsBack: string
    imageOfComponentsBase: string
    imageOfComponentsCastors: string
    imageOfComponentsGasLiftCover: string
    imageOfComponentsGasLiftStamp: string
    imageOfComponentsArmrest: string
    imageOfComponentMechanism: string
    imageOfComponentsHeadrest: string
    imageOfProductBuiltFront: string
    imageOfProductBuiltSide: string
    imageOfProductBuiltBack: string
    imageOfProductBuilt45Degree: string
    frontImageOfProductBuiltCompare1: string
    frontImageOfProductBuiltCompare2: string
    functionCheckSeatHeightExtension: string
    functionCheckMechanismAdjustment: string
    functionCheckArmrestAdjustment: string
    functionCheckHeadrestAdjustment: string
    functionCheckOther1: string
    functionCheckOther2: string
  }
  defectsDTO: DefectsDTO[]
} 