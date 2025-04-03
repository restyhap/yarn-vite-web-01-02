import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageQuotation } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /quotation/search
 */
export function getQuotationSearch(config?: AxiosRequestConfig) {
    return request.get<ResultVo<PageQuotation>>(`/quotation/search`, config);
}
