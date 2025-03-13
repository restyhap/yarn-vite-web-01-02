import request from "@/api/request";
import { type ResultVo, type DeepRequired, type Permissions } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /permissions/save
 */
export function postPermissionsSave(input: Permissions, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/permissions/save`, input, config);
}
