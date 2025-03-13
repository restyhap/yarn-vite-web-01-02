import request from "@/api/request";
import { type ResultVo, type DeepRequired, type Products } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /products/update
 */
export function putProductsUpdate(input: Products, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/products/update`, input, config);
}
