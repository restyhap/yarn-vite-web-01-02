import request from "@/api/request";
import { type ResultVo, type DeepRequired, type SeatOuterComponents } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /seatOuterComponents/save
 */
export function postSeatOuterComponentsSave(input: SeatOuterComponents, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/seatOuterComponents/save`, input, config);
}
