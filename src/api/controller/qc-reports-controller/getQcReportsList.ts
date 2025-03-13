import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /qcReports/list
 */
export function getQcReportsList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/qcReports/list`, config);
}
