import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageArms } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /arms/page
 */
export function getArmsPage(params: GetArmsPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/arms/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetArmsPageParams {
    page: PageArms;
}
