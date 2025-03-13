import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /upholstery/remove/{id}
 */
export function deleteUpholsteryRemoveById(params: DeleteUpholsteryRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/upholstery/remove/${params.id}`, config);
}

export interface DeleteUpholsteryRemoveByIdParams {
    id: string;
}
