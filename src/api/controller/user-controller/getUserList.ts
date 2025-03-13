import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /user/list
 */
export function getUserList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/user/list`, config);
}
