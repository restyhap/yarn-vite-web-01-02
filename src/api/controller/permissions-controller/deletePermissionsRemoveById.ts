import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /permissions/remove/{id}
 */
export function deletePermissionsRemoveById(params: DeletePermissionsRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/permissions/remove/${params.id}`, config);
}

export interface DeletePermissionsRemoveByIdParams {
    id: string;
}
