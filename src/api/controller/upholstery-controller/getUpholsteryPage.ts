import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageUpholstery } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /upholstery/page
 */
export function getUpholsteryPage(params: GetUpholsteryPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/upholstery/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetUpholsteryPageParams {
    page: PageUpholstery;
}
