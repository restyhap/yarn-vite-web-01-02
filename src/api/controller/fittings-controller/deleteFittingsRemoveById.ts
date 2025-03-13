import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /fittings/remove/{id}
 */
export function deleteFittingsRemoveById(params: DeleteFittingsRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/fittings/remove/${params.id}`, config);
}

export interface DeleteFittingsRemoveByIdParams {
    id: string;
}
