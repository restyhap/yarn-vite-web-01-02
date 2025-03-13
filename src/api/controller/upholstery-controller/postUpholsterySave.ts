import request from "@/api/request";
import { type ResultVo, type DeepRequired, type Upholstery } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /upholstery/save
 */
export function postUpholsterySave(input: Upholstery, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/upholstery/save`, input, config);
}
