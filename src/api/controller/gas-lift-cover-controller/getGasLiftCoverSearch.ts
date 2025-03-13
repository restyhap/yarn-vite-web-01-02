import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /gasLiftCover/search
 */
export function getGasLiftCoverSearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/gasLiftCover/search`, config);
}
