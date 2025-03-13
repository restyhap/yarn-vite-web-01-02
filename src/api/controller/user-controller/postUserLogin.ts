import request from "@/api/request";
import { type ResultVo, type DeepRequired, type User } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /user/login
 */
export function postUserLogin(input: User, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/user/login`, input, config);
}
