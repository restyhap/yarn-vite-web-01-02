import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /permissions/getInfo/{id}
 */
export function getPermissionsGetInfoById(params: GetPermissionsGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/permissions/getInfo/${params.id}`, config);
}

export interface GetPermissionsGetInfoByIdParams {
    id: string;
}
