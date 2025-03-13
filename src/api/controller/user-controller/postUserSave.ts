import request from "@/api/request";
import { type ResultVo, type DeepRequired, type User } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /user/save
 */
export function postUserSave(input: User, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/user/save`, input, config);
}
