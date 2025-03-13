import request from "@/api/request";
import { type ResultVo, type DeepRequired, type ProductDimensions } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productDimensions/update
 */
export function putProductDimensionsUpdate(input: ProductDimensions, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/productDimensions/update`, input, config);
}
