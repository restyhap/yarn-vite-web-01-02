import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageGasLiftCover } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /gasLiftCover/page
 */
export function getGasLiftCoverPage(params: GetGasLiftCoverPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/gasLiftCover/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetGasLiftCoverPageParams {
    page: PageGasLiftCover;
}
