import request from "@/api/request";
import { type ResultVo, type DeepRequired, type DefectImages } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /defectImages/update
 */
export function putDefectImagesUpdate(input: DefectImages, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/defectImages/update`, input, config);
}
