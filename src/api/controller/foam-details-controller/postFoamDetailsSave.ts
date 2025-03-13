import request from "@/api/request";
import { type ResultVo, type DeepRequired, type FoamDetails } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /foamDetails/save
 */
export function postFoamDetailsSave(input: FoamDetails, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/foamDetails/save`, input, config);
}
