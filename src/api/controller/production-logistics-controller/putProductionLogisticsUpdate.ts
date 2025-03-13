import request from "@/api/request";
import { type ResultVo, type DeepRequired, type ProductionLogistics } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productionLogistics/update
 */
export function putProductionLogisticsUpdate(input: ProductionLogistics, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/productionLogistics/update`, input, config);
}
