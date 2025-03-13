import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageSeatInnerComponents } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /seatInnerComponents/page
 */
export function getSeatInnerComponentsPage(params: GetSeatInnerComponentsPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/seatInnerComponents/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetSeatInnerComponentsPageParams {
    page: PageSeatInnerComponents;
}
