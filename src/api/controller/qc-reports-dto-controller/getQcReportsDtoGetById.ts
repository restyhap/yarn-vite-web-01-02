import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /qcReportsDto/get/{id}
 */
export function getQcReportsDtoGetById(params: GetQcReportsDtoGetByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/qcReportsDto/get/${params.id}`, config);
}

export interface GetQcReportsDtoGetByIdParams {
    id: string;
}
