import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /gasLiftCover/getInfo/{id}
 */
export function getGasLiftCoverGetInfoById(params: GetGasLiftCoverGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/gasLiftCover/getInfo/${params.id}`, config);
}

export interface GetGasLiftCoverGetInfoByIdParams {
    id: string;
}
