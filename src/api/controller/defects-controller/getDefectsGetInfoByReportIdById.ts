import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /defects/getInfoByReportId/{id}
 */
export function getDefectsGetInfoByReportIdById(params: GetDefectsGetInfoByReportIdByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/defects/getInfoByReportId/${params.id}`, config);
}

export interface GetDefectsGetInfoByReportIdByIdParams {
    id: string;
}
