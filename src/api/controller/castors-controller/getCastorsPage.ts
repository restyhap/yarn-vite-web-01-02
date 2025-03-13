import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageCastors } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /castors/page
 */
export function getCastorsPage(params: GetCastorsPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/castors/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetCastorsPageParams {
    page: PageCastors;
}
