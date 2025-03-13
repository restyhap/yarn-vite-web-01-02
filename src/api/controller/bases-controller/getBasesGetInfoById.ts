import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /bases/getInfo/{id}
 */
export function getBasesGetInfoById(params: GetBasesGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/bases/getInfo/${params.id}`, config);
}

export interface GetBasesGetInfoByIdParams {
    id: string;
}
