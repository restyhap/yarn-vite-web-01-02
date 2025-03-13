import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /fittings/getInfo/{id}
 */
export function getFittingsGetInfoById(params: GetFittingsGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/fittings/getInfo/${params.id}`, config);
}

export interface GetFittingsGetInfoByIdParams {
    id: string;
}
