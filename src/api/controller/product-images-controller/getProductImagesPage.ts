import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageProductImages } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productImages/page
 */
export function getProductImagesPage(params: GetProductImagesPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/productImages/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetProductImagesPageParams {
    page: PageProductImages;
}
