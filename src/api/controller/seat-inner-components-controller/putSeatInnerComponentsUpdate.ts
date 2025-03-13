import request from "@/api/request";
import { type ResultVo, type DeepRequired, type SeatInnerComponents } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /seatInnerComponents/update
 */
export function putSeatInnerComponentsUpdate(input: SeatInnerComponents, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/seatInnerComponents/update`, input, config);
}
