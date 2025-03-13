import request from "@/api/request";
import { type ResultVo, type DeepRequired, type SeatOuterComponents } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /seatOuterComponents/update
 */
export function putSeatOuterComponentsUpdate(input: SeatOuterComponents, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/seatOuterComponents/update`, input, config);
}
