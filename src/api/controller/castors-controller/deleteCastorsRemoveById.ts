import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /castors/remove/{id}
 */
export function deleteCastorsRemoveById(params: DeleteCastorsRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/castors/remove/${params.id}`, config);
}

export interface DeleteCastorsRemoveByIdParams {
    id: string;
}
