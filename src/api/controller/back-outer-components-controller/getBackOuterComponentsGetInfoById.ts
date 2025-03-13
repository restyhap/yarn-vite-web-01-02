import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /backOuterComponents/getInfo/{id}
 */
export function getBackOuterComponentsGetInfoById(params: GetBackOuterComponentsGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/backOuterComponents/getInfo/${params.id}`, config);
}

export interface GetBackOuterComponentsGetInfoByIdParams {
    id: string;
}
