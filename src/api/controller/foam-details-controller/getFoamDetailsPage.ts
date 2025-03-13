import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageFoamDetails } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /foamDetails/page
 */
export function getFoamDetailsPage(params: GetFoamDetailsPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/foamDetails/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetFoamDetailsPageParams {
    page: PageFoamDetails;
}
