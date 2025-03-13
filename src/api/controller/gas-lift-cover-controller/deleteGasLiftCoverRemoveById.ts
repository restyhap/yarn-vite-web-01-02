import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /gasLiftCover/remove/{id}
 */
export function deleteGasLiftCoverRemoveById(params: DeleteGasLiftCoverRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/gasLiftCover/remove/${params.id}`, config);
}

export interface DeleteGasLiftCoverRemoveByIdParams {
    id: string;
}
