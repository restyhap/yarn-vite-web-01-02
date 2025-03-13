import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageBases } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /bases/page
 */
export function getBasesPage(params: GetBasesPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/bases/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetBasesPageParams {
    page: PageBases;
}
