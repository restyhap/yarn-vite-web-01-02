import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /seatOuterComponents/getInfo/{id}
 */
export function getSeatOuterComponentsGetInfoById(params: GetSeatOuterComponentsGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/seatOuterComponents/getInfo/${params.id}`, config);
}

export interface GetSeatOuterComponentsGetInfoByIdParams {
    id: string;
}
