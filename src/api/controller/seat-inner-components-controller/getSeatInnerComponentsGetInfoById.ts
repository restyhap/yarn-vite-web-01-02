import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /seatInnerComponents/getInfo/{id}
 */
export function getSeatInnerComponentsGetInfoById(params: GetSeatInnerComponentsGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/seatInnerComponents/getInfo/${params.id}`, config);
}

export interface GetSeatInnerComponentsGetInfoByIdParams {
    id: string;
}
