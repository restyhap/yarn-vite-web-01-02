import request from "@/api/request";
import { type ResultVo, type DeepRequired, type Products } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /products/save
 */
export function postProductsSave(input: Products, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/products/save`, input, config);
}
