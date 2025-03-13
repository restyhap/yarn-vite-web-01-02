import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageBackInnerComponents } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /backInnerComponents/page
 */
export function getBackInnerComponentsPage(params: GetBackInnerComponentsPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/backInnerComponents/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetBackInnerComponentsPageParams {
    page: PageBackInnerComponents;
}
