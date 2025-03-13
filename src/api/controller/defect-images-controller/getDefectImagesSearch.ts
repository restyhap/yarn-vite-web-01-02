import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /defectImages/search
 */
export function getDefectImagesSearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/defectImages/search`, config);
}
