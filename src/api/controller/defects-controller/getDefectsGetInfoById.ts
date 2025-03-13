import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /defects/getInfo/{id}
 */
export function getDefectsGetInfoById(params: GetDefectsGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/defects/getInfo/${params.id}`, config);
}

export interface GetDefectsGetInfoByIdParams {
    id: string;
}
