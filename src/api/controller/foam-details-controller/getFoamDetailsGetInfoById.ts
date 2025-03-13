import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /foamDetails/getInfo/{id}
 */
export function getFoamDetailsGetInfoById(params: GetFoamDetailsGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/foamDetails/getInfo/${params.id}`, config);
}

export interface GetFoamDetailsGetInfoByIdParams {
    id: string;
}
