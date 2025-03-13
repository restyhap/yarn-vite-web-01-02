import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /products/getInfo/{id}
 */
export function getProductsGetInfoById(params: GetProductsGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/products/getInfo/${params.id}`, config);
}

export interface GetProductsGetInfoByIdParams {
    id: string;
}
