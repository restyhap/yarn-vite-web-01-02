import request from "@/api/request";
import { type ResultVo, type DeepRequired, type SeatInnerComponents } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /seatInnerComponents/save
 */
export function postSeatInnerComponentsSave(input: SeatInnerComponents, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/seatInnerComponents/save`, input, config);
}
