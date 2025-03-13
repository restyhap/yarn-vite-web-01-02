import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productDimensions/getInfo/{id}
 */
export function getProductDimensionsGetInfoById(params: GetProductDimensionsGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/productDimensions/getInfo/${params.id}`, config);
}

export interface GetProductDimensionsGetInfoByIdParams {
    id: string;
}
