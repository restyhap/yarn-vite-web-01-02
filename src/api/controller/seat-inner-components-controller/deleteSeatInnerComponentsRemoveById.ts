import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /seatInnerComponents/remove/{id}
 */
export function deleteSeatInnerComponentsRemoveById(params: DeleteSeatInnerComponentsRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/seatInnerComponents/remove/${params.id}`, config);
}

export interface DeleteSeatInnerComponentsRemoveByIdParams {
    id: string;
}
