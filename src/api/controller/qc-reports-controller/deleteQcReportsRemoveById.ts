import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /qcReports/remove/{id}
 */
export function deleteQcReportsRemoveById(params: DeleteQcReportsRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/qcReports/remove/${params.id}`, config);
}

export interface DeleteQcReportsRemoveByIdParams {
    id: string;
}
