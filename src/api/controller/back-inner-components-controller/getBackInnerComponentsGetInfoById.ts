import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /backInnerComponents/getInfo/{id}
 */
export function getBackInnerComponentsGetInfoById(params: GetBackInnerComponentsGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/backInnerComponents/getInfo/${params.id}`, config);
}

export interface GetBackInnerComponentsGetInfoByIdParams {
    id: string;
}
