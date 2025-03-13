import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /cartonDetails/remove/{id}
 */
export function deleteCartonDetailsRemoveById(params: DeleteCartonDetailsRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/cartonDetails/remove/${params.id}`, config);
}

export interface DeleteCartonDetailsRemoveByIdParams {
    id: string;
}
