import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageGasLift } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /gasLift/page
 */
export function getGasLiftPage(params: GetGasLiftPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/gasLift/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetGasLiftPageParams {
    page: PageGasLift;
}
