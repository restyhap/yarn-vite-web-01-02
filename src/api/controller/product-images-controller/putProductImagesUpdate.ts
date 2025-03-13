import request from "@/api/request";
import { type ResultVo, type DeepRequired, type ProductImages } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productImages/update
 */
export function putProductImagesUpdate(input: ProductImages, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/productImages/update`, input, config);
}
