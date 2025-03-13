import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /user/search
 */
export function getUserSearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/user/search`, config);
}
