import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageProductionLogistics } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productionLogistics/page
 */
export function getProductionLogisticsPage(params: GetProductionLogisticsPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/productionLogistics/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetProductionLogisticsPageParams {
    page: PageProductionLogistics;
}
