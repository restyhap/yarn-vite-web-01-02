import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /mechanism/remove/{id}
 */
export function deleteMechanismRemoveById(params: DeleteMechanismRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/mechanism/remove/${params.id}`, config);
}

export interface DeleteMechanismRemoveByIdParams {
    id: string;
}
