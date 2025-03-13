import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageSeatOuterComponents } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /seatOuterComponents/page
 */
export function getSeatOuterComponentsPage(params: GetSeatOuterComponentsPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/seatOuterComponents/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetSeatOuterComponentsPageParams {
    page: PageSeatOuterComponents;
}
