import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productImages/remove/{id}
 */
export function deleteProductImagesRemoveById(params: DeleteProductImagesRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/productImages/remove/${params.id}`, config);
}

export interface DeleteProductImagesRemoveByIdParams {
    id: string;
}
