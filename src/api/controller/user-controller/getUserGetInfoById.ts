import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /user/getInfo/{id}
 */
export function getUserGetInfoById(params: GetUserGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/user/getInfo/${params.id}`, config);
}

export interface GetUserGetInfoByIdParams {
    id: string;
}
