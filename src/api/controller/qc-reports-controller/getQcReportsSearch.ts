import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /qcReports/search
 */
export function getQcReportsSearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/qcReports/search`, config);
}
