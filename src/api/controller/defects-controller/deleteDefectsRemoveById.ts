import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /defects/remove/{id}
 */
export function deleteDefectsRemoveById(params: DeleteDefectsRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/defects/remove/${params.id}`, config);
}

export interface DeleteDefectsRemoveByIdParams {
    id: string;
}
