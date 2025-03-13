import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageBackOuterComponents } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /backOuterComponents/page
 */
export function getBackOuterComponentsPage(params: GetBackOuterComponentsPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/backOuterComponents/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetBackOuterComponentsPageParams {
    page: PageBackOuterComponents;
}
