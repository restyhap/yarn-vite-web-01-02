import request from "@/api/request";
import { type ResultVo, type DeepRequired, type User } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /user/update
 */
export function putUserUpdate(input: User, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/user/update`, input, config);
}
