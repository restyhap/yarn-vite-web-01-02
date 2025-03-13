import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /arms/getInfo/{id}
 */
export function getArmsGetInfoById(params: GetArmsGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/arms/getInfo/${params.id}`, config);
}

export interface GetArmsGetInfoByIdParams {
    id: string;
}
