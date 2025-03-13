import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /arms/remove/{id}
 */
export function deleteArmsRemoveById(params: DeleteArmsRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/arms/remove/${params.id}`, config);
}

export interface DeleteArmsRemoveByIdParams {
    id: string;
}
