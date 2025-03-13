import request from "@/api/request";
import { type ResultVo, type DeepRequired, type QcReportsDto } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /qcReportsDto/save
 */
export function postQcReportsDtoSave(input: QcReportsDto, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/qcReportsDto/save`, input, config);
}
