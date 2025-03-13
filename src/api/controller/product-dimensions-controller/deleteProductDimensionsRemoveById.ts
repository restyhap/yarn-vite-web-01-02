import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productDimensions/remove/{id}
 */
export function deleteProductDimensionsRemoveById(params: DeleteProductDimensionsRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/productDimensions/remove/${params.id}`, config);
}

export interface DeleteProductDimensionsRemoveByIdParams {
    id: string;
}
