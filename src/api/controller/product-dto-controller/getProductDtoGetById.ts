/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-18 16:25:17
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-18 16:30:19
 * @FilePath: /yarn-vite-web-01-02/src/api/controller/product-dto-controller/getProductDtoGetById.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from "@/api/request";
import { type ResultVo, type DeepRequired, type ProductDto } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productDto/get/{id}
 */
export function getProductDtoGetById(params: GetProductDtoGetByIdParams, config?: AxiosRequestConfig) {
    return request.get<ResultVo<DeepRequired<ProductDto>>>(`/productDto/get/${params.id}`, config);
}

export interface GetProductDtoGetByIdParams {
    id: string;
}
