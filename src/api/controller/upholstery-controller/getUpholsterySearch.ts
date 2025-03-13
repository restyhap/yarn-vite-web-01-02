import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /upholstery/search
 */
export function getUpholsterySearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/upholstery/search`, config);
}
