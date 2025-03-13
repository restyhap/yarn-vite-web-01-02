import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /bases/remove/{id}
 */
export function deleteBasesRemoveById(params: DeleteBasesRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/bases/remove/${params.id}`, config);
}

export interface DeleteBasesRemoveByIdParams {
    id: string;
}
