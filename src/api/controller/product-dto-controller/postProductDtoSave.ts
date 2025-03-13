import request from "@/api/request";
import { type ResultVo, type DeepRequired, type ProductDto } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productDto/save
 */
export function postProductDtoSave(input: ProductDto, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/productDto/save`, input, config);
}
