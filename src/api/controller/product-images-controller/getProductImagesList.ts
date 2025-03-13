import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productImages/list
 */
export function getProductImagesList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/productImages/list`, config);
}
