import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /qcReportsDto/delete/{id}
 */
export function deleteQcReportsDtoDeleteById(params: DeleteQcReportsDtoDeleteByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/qcReportsDto/delete/${params.id}`, config);
}

export interface DeleteQcReportsDtoDeleteByIdParams {
    id: string;
}
