import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageUser } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /user/page
 */
export function getUserPage(params: GetUserPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/user/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetUserPageParams {
    page: PageUser;
}
