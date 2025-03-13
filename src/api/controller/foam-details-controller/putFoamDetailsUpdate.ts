import request from "@/api/request";
import { type ResultVo, type DeepRequired, type FoamDetails } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /foamDetails/update
 */
export function putFoamDetailsUpdate(input: FoamDetails, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/foamDetails/update`, input, config);
}
