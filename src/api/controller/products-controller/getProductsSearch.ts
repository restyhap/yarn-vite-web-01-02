import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /products/search
 */
export function getProductsSearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/products/search`, config);
}
