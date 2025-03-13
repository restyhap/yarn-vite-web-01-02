import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /seatOuterComponents/list
 */
export function getSeatOuterComponentsList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/seatOuterComponents/list`, config);
}
