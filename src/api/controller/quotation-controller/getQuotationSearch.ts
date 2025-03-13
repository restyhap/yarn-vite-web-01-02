import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /quotation/search
 */
export function getQuotationSearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/quotation/search`, config);
}
