import request from "@/api/request";
import { type ResultVo, type DeepRequired, type DefectImages } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /defectImages/save
 */
export function postDefectImagesSave(input: DefectImages, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/defectImages/save`, input, config);
}
