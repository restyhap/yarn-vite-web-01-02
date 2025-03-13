import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageQcReports } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /qcReports/page
 */
export function getQcReportsPage(params: GetQcReportsPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/qcReports/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetQcReportsPageParams {
    page: PageQcReports;
}
