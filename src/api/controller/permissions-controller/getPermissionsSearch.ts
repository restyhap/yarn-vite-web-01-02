import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /permissions/search
 */
export function getPermissionsSearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/permissions/search`, config);
}
