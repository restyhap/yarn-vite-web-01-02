import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /user/remove/{id}
 */
export function deleteUserRemoveById(params: DeleteUserRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/user/remove/${params.id}`, config);
}

export interface DeleteUserRemoveByIdParams {
    id: string;
}
