/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-01-18 14:14:01
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-02-19 12:49:00
 * @Description: 产品相关接口
 */
import http from '../axios'
import type { AxiosResponse } from 'axios'

import type { Product, ProductDTO , ProductParams } from './product.d'
import type { CartonDetail, ProductDimension, ProductionLogistics, SeatInnerComponent, SeatOuterComponent, BackInnerComponent, BackOuterComponent, Arm, FoamDetail, Castor, Base, GasLift, GasLiftCover, Mechanism, Fitting, ProductImage, Upholstery } from './product.d'

/**
 * 保存产品DTO
 * @param {ProductDTO} data - 产品DTO
 * @returns {Promise}
 */
export const saveProductDTO = (data: Partial<ProductDTO>) => {
  console.log('调用 saveProductDTO API, data:', data)
  return http.post('/productDto/save', data)
}

// 修改 getProductDTOById 函数
export const getProductDTOById = (id: string): Promise<AxiosResponse<ProductDTO>> => {
  console.log('调用 getProductDTOById API, id:', id)
  return http.get(`/productDto/get/${id}`)
}

/**
 * 删除产品DTO
 * @param {number} id - 产品DTO ID
 * @returns {Promise}
 */
export const removeProductDto = (id: string) => {
  return http.delete(`/productDto/delete/${id}`)
}





/**** 产品基本信息接口 ****/
/**
 * 搜索产品
 * @param {ProductParams} params - 搜索参数
 * @returns {Promise}
 */
export const searchProduct = (params: ProductParams) => {
  return http.get('/product/search', { params })
}

/**
 * 获取产品列表
 * @returns {Promise}
 */
export const getProductList = () => {
  return http.get('/product/list')
}

/**
 * 分页获取产品列表
 * @param {ProductParams} params - 分页参数
 * @returns {Promise}
 */
export const getProductPage = (params: ProductParams) => {
  return http.get('/products/page', { params })
}

/**
 * 获取产品详情
 * @param {number} id - 产品ID
 * @returns {Promise}
 */
export const getProductDetail = (id: number) => {
  return http.get(`/products/getInfo/${id}`)
}

// 修改 addProduct 和 updateProduct 函数的类型
export const addProduct = (data: ProductDTO) => {
  return http.post('/products/save', data)
}



/**
 * 删除产品
 * @param {number} id - 产品ID
 * @returns {Promise}
 */
export const deleteProduct = (id: number) => {
  return http.delete(`/products/remove/${id}`)
}

// 基础产品信息
export const updateProduct = (data: Product) => {
  return http.put('/products/update', data)
}

// 包装信息
export const updateCartonDetail = (data: CartonDetail) => {
  return http.put('/cartonDetails/update', data)
}

// 产品尺寸
export const updateProductDimension = (data: ProductDimension) => {
  return http.put('/productDimensions/update', data)
}

// 生产物流
export const updateProductionLogistics = (data: ProductionLogistics) => {
  return http.put('/productionLogistics/update', data)
}

// 座椅内部组件
export const updateSeatInnerComponent = (data: SeatInnerComponent) => {
  return http.put('/seatInnerComponents/update', data)
}

// 座椅外部组件
export const updateSeatOuterComponent = (data: SeatOuterComponent) => {
  return http.put('/seatOuterComponents/update', data)
}

// 靠背内部组件
export const updateBackInnerComponent = (data: BackInnerComponent) => {
  return http.put('/backInnerComponents/update', data)
}

// 靠背外部组件
export const updateBackOuterComponent = (data: BackOuterComponent) => {
  return http.put('/backOuterComponents/update', data)
}

// 扶手信息
export const updateArm = (data: Arm) => {
  return http.put('/arms/update', data)
}

// 海绵详情
export const updateFoamDetail = (data: FoamDetail) => {
  return http.put('/foamDetails/update', data)
}

// 脚轮信息
export const updateCastor = (data: Castor) => {
  return http.put('/castors/update', data)
}

// 底座信息
export const updateBase = (data: Base) => {
  return http.put('/bases/update', data)
}

// 气压棒信息
export const updateGasLift = (data: GasLift) => {
  return http.put('/gasLifts/update', data)
}

// 气压棒护罩
export const updateGasLiftCover = (data: GasLiftCover) => {
  return http.put('/gasLiftCovers/update', data)
}

// 机构信息
export const updateMechanism = (data: Mechanism) => {
  return http.put('/mechanisms/update', data)
}

// 配件信息
export const updateFitting = (data: Fitting) => {
  return http.put('/fittings/update', data)
}

// 产品图片
export const updateProductImage = (data: ProductImage) => {
  return http.put('/productImages/update', data)
}

// 面料信息
export const updateUpholstery = (data: Upholstery) => {
  return http.put('/upholstery/update', data)
}

// 修改 saveData 函数，根据不同的 section 调用对应的更新函数
export const saveData = async (section: string, data: any) => {
  const updateFunctions: { [key: string]: (data: any) => Promise<any> } = {
    products: updateProduct,
    packaging: updateCartonDetail,
    dimensions: updateProductDimension,
    logistics: updateProductionLogistics,
    seatInner: updateSeatInnerComponent,
    seatOuter: updateSeatOuterComponent,
    backInner: updateBackInnerComponent,
    backOuter: updateBackOuterComponent,
    arms: updateArm,
    foam: updateFoamDetail,
    castors: updateCastor,
    base: updateBase,
    gasLift: updateGasLift,
    gasLiftCover: updateGasLiftCover,
    mechanism: updateMechanism,
    fittings: updateFitting,
    images: updateProductImage,
    upholstery: updateUpholstery
  }

  const updateFunction = updateFunctions[section]
  if (!updateFunction) {
    throw new Error(`未找到 ${section} 对应的更新函数`)
  }

  return updateFunction(data)
} 