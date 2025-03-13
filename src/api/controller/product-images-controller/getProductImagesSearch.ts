import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productImages/search
 */
export function getProductImagesSearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/productImages/search`, config);
}
