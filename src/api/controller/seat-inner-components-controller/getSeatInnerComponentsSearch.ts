import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /seatInnerComponents/search
 */
export function getSeatInnerComponentsSearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/seatInnerComponents/search`, config);
}
