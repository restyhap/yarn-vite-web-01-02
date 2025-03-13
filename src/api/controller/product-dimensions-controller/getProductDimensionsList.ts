import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productDimensions/list
 */
export function getProductDimensionsList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/productDimensions/list`, config);
}
