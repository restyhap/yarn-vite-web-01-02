import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageDefects } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /defects/page
 */
export function getDefectsPage(params: GetDefectsPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/defects/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetDefectsPageParams {
    page: PageDefects;
}
