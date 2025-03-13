import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /foamDetails/remove/{id}
 */
export function deleteFoamDetailsRemoveById(params: DeleteFoamDetailsRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/foamDetails/remove/${params.id}`, config);
}

export interface DeleteFoamDetailsRemoveByIdParams {
    id: string;
}
