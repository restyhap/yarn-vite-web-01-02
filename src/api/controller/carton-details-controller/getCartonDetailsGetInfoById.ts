import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /cartonDetails/getInfo/{id}
 */
export function getCartonDetailsGetInfoById(params: GetCartonDetailsGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/cartonDetails/getInfo/${params.id}`, config);
}

export interface GetCartonDetailsGetInfoByIdParams {
    id: string;
}
