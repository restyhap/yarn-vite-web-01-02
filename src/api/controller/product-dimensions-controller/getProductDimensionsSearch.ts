import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productDimensions/search
 */
export function getProductDimensionsSearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/productDimensions/search`, config);
}
