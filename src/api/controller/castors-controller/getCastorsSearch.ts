import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /castors/search
 */
export function getCastorsSearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/castors/search`, config);
}
