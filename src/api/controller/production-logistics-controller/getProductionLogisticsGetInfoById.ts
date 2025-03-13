import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productionLogistics/getInfo/{id}
 */
export function getProductionLogisticsGetInfoById(params: GetProductionLogisticsGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/productionLogistics/getInfo/${params.id}`, config);
}

export interface GetProductionLogisticsGetInfoByIdParams {
    id: string;
}
