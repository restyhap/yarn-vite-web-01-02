interface QuotationSearchParams {
  keyword?: string
  currentPage?: number
  pageSize?: number
  pageNumber?: number
}

interface QuotationResponse {
  data: {
    dataList?: any[]
    totalCount?: number
    records?: any[]
    totalRow?: number
    pageNumber?: number
    pageSize?: number
  }
}

export function searchQuotation(params: QuotationSearchParams): Promise<QuotationResponse>
export function getQuotationPage(params: QuotationSearchParams): Promise<QuotationResponse>
export function deleteQuotation(id: number): Promise<any> 