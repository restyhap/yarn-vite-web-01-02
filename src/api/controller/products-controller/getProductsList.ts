import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /products/list
 */
export function getProductsList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/products/list`, config);
}
