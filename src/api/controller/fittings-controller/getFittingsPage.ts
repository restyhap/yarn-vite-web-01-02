import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageFittings } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /fittings/page
 */
export function getFittingsPage(params: GetFittingsPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/fittings/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetFittingsPageParams {
    page: PageFittings;
}
