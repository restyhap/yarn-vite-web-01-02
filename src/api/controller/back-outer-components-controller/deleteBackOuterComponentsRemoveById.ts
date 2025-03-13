import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /backOuterComponents/remove/{id}
 */
export function deleteBackOuterComponentsRemoveById(params: DeleteBackOuterComponentsRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/backOuterComponents/remove/${params.id}`, config);
}

export interface DeleteBackOuterComponentsRemoveByIdParams {
    id: string;
}
