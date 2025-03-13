import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /gasLift/remove/{id}
 */
export function deleteGasLiftRemoveById(params: DeleteGasLiftRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/gasLift/remove/${params.id}`, config);
}

export interface DeleteGasLiftRemoveByIdParams {
    id: string;
}
