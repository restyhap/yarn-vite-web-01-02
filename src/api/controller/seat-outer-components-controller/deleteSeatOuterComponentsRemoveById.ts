import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /seatOuterComponents/remove/{id}
 */
export function deleteSeatOuterComponentsRemoveById(params: DeleteSeatOuterComponentsRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/seatOuterComponents/remove/${params.id}`, config);
}

export interface DeleteSeatOuterComponentsRemoveByIdParams {
    id: string;
}
