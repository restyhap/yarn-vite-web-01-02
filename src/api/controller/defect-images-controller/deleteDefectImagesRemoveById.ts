import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /defectImages/remove/{id}
 */
export function deleteDefectImagesRemoveById(params: DeleteDefectImagesRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/defectImages/remove/${params.id}`, config);
}

export interface DeleteDefectImagesRemoveByIdParams {
    id: string;
}
