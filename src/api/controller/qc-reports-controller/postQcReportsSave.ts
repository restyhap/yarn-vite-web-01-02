import request from "@/api/request";
import { type ResultVo, type DeepRequired, type QcReports } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /qcReports/save
 */
export function postQcReportsSave(input: QcReports, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/qcReports/save`, input, config);
}
