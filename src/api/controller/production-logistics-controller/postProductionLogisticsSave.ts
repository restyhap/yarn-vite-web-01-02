import request from "@/api/request";
import { type ResultVo, type DeepRequired, type ProductionLogistics } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productionLogistics/save
 */
export function postProductionLogisticsSave(input: ProductionLogistics, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/productionLogistics/save`, input, config);
}
