import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageCartonDetails } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /cartonDetails/page
 */
export function getCartonDetailsPage(params: GetCartonDetailsPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/cartonDetails/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetCartonDetailsPageParams {
    page: PageCartonDetails;
}
