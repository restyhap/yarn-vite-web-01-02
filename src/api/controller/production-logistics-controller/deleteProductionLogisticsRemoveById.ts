import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productionLogistics/remove/{id}
 */
export function deleteProductionLogisticsRemoveById(params: DeleteProductionLogisticsRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/productionLogistics/remove/${params.id}`, config);
}

export interface DeleteProductionLogisticsRemoveByIdParams {
    id: string;
}
