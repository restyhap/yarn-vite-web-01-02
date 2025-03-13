import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /qcReports/getInfo/{id}
 */
export function getQcReportsGetInfoById(params: GetQcReportsGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/qcReports/getInfo/${params.id}`, config);
}

export interface GetQcReportsGetInfoByIdParams {
    id: string;
}
