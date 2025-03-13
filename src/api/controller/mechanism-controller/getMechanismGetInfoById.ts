import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /mechanism/getInfo/{id}
 */
export function getMechanismGetInfoById(params: GetMechanismGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/mechanism/getInfo/${params.id}`, config);
}

export interface GetMechanismGetInfoByIdParams {
    id: string;
}
