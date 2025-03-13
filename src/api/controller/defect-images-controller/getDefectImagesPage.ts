import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageDefectImages } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /defectImages/page
 */
export function getDefectImagesPage(params: GetDefectImagesPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/defectImages/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetDefectImagesPageParams {
    page: PageDefectImages;
}
