import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /permissions/list
 */
export function getPermissionsList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/permissions/list`, config);
}
