import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /castors/list
 */
export function getCastorsList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/castors/list`, config);
}
