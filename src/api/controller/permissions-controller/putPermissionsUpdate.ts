import request from "@/api/request";
import { type ResultVo, type DeepRequired, type Permissions } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /permissions/update
 */
export function putPermissionsUpdate(input: Permissions, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/permissions/update`, input, config);
}
