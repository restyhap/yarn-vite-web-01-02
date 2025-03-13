import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /gasLiftCover/list
 */
export function getGasLiftCoverList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/gasLiftCover/list`, config);
}
