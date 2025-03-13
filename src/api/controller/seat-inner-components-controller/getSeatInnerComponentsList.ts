import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /seatInnerComponents/list
 */
export function getSeatInnerComponentsList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/seatInnerComponents/list`, config);
}
