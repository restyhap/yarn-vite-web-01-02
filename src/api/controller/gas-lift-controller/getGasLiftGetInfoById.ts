import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /gasLift/getInfo/{id}
 */
export function getGasLiftGetInfoById(params: GetGasLiftGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/gasLift/getInfo/${params.id}`, config);
}

export interface GetGasLiftGetInfoByIdParams {
    id: string;
}
