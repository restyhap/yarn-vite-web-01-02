import request from "@/api/request";
import { type ResultVo, type DeepRequired, type QcReports } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /qcReports/update
 */
export function putQcReportsUpdate(input: QcReports, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/qcReports/update`, input, config);
}
