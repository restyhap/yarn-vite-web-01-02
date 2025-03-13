import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /backInnerComponents/remove/{id}
 */
export function deleteBackInnerComponentsRemoveById(params: DeleteBackInnerComponentsRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/backInnerComponents/remove/${params.id}`, config);
}

export interface DeleteBackInnerComponentsRemoveByIdParams {
    id: string;
}
