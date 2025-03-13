import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /castors/getInfo/{id}
 */
export function getCastorsGetInfoById(params: GetCastorsGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/castors/getInfo/${params.id}`, config);
}

export interface GetCastorsGetInfoByIdParams {
    id: string;
}
