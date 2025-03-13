import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /seatOuterComponents/search
 */
export function getSeatOuterComponentsSearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/seatOuterComponents/search`, config);
}
