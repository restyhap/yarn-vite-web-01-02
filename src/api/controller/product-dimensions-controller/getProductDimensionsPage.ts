import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageProductDimensions } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productDimensions/page
 */
export function getProductDimensionsPage(params: GetProductDimensionsPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/productDimensions/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetProductDimensionsPageParams {
    page: PageProductDimensions;
}
