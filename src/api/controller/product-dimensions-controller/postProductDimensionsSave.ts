import request from "@/api/request";
import { type ResultVo, type DeepRequired, type ProductDimensions } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productDimensions/save
 */
export function postProductDimensionsSave(input: ProductDimensions, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/productDimensions/save`, input, config);
}
