/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-02-14 16:44:05
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-02-18 10:22:38
 * @FilePath: /yarn-vite-web-01-02/src/api/specification.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export interface SpecificationSearchParams {
  keyword?: string
  pageNumber?: number
  pageSize?: number
}


export interface SpecificationResponse {
  data: {
    records?: QCReportRecord[]
    totalRow?: number
    pageNumber?: number
    pageSize?: number
  }
}

export function searchSpecification(params: SpecificationSearchParams): Promise<SpecificationResponse>
export function getSpecificationPage(params: SpecificationSearchParams): Promise<SpecificationResponse>
export function deleteSpecification(id: string): Promise<any>

export interface IQCReport {
  id: string
  modelCode: string
  factoryCode: string
  supplier: string
  client: string
  poNumber: string
  inspectionDate: string
  orderQty: number
  reportDate: string
  inspectQty: number
  qcOfficer: string
  passFail: 'Pass' | 'Fail'
  secondQcDate: string
  comments: string
  // 产品外观图片
  stocksInWarehouse: string
  samplingOfProductsQuantity: string
  shippingMarks: string
  barcode: string
  packingOutside: string
  packingInside: string
  // 椅子组件图片
  chairComponentsPacked: string
  chairComponentsUnpacked: string
  // 配件包图片
  fittingPackPacked: string
  fittingPackUnpacked: string
  // 标签和说明图片
  productionLabel: string
  assemblyInstructions: string
  // 组件图片
  imageOfComponentsSeat: string
  imageOfComponentsBack: string
  imageOfComponentsBase: string
  imageOfComponentsCastors: string
  imageOfComponentsGasLiftCover: string
  imageOfComponentsGasLiftStamp: string
  imageOfComponentsArmrest: string
  imageOfComponentMechanism: string
  imageOfComponentsHeadrest: string
  // 成品图片
  imageOfProductBuiltFront: string
  imageOfProductBuiltSide: string
  imageOfProductBuiltBack: string
  imageOfProductBuilt45Degree: string
  frontImageOfProductBuiltCompare1: string
  frontImageOfProductBuiltCompare2: string
  // 功能检查图片
  functionCheckSeatHeightExtension: string
  functionCheckMechanismAdjustment: string
  functionCheckArmrestAdjustment: string
  functionCheckHeadrestAdjustment: string
  functionCheckOther1: string
  functionCheckOther2: string
  createdAt: string
  updatedAt: string
}

export interface IDefect {
  id: string
  reportId: string
  defectTitle: string
  defectDescription: string
  improvementSuggestion: string
  inspector: string
  createdAt: string
  updatedAt: string
}

export interface IDefectImage {
  id: string
  defectId: string
  imagePath: string
  createdAt: string
  updatedAt: string
} 