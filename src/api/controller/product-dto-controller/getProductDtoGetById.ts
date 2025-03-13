import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productDto/get/{id}
 */
export function getProductDtoGetById(params: GetProductDtoGetByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/productDto/get/${params.id}`, config);
}

export interface GetProductDtoGetByIdParams {
    id: string;
}
