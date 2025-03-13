import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageMechanism } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /mechanism/page
 */
export function getMechanismPage(params: GetMechanismPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/mechanism/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetMechanismPageParams {
    page: PageMechanism;
}
