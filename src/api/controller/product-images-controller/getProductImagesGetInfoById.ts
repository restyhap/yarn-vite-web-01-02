import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productImages/getInfo/{id}
 */
export function getProductImagesGetInfoById(params: GetProductImagesGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/productImages/getInfo/${params.id}`, config);
}

export interface GetProductImagesGetInfoByIdParams {
    id: string;
}
