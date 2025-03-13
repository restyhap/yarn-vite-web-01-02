import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productionLogistics/list
 */
export function getProductionLogisticsList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/productionLogistics/list`, config);
}
