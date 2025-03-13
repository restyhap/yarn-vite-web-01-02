import request from "@/api/request";
import { type ResultVo, type DeepRequired, type GasLiftCover } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /gasLiftCover/save
 */
export function postGasLiftCoverSave(input: GasLiftCover, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/gasLiftCover/save`, input, config);
}
