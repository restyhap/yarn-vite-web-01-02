import request from "@/api/request";
import { type ResultVo, type DeepRequired, type ProductImages } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productImages/save
 */
export function postProductImagesSave(input: ProductImages, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/productImages/save`, input, config);
}
