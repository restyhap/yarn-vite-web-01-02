export interface Quotation {
    id?: string;
    image?: string;
    supplier?: string;
    supplierItemCode?: string;
    specificationDetails?: string;
    sampleLeadTime?: string;
    overallDimensionsWidth?: number;
    overallDimensionsDepth?: number;
    overallDimensionsHeight?: number;
    boxDimensionsWidth?: number;
    boxDimensionsDepth?: number;
    boxDimensionsHeight?: number;
    boxWeightNetWeighth?: number;
    netWeightGrossWeight?: string;
    effectiveVol?: string;
    loadingQty?: number;
    moq?: string;
    fobPrice?: number;
    currency?: number;
    bifmaTested?: number;
    cadBlockAvailable?: number;
    productDataAvailable?: number;
    productImagesAvailable?: number;
    salesContacts?: string;
    createTime?: string;
    validPeriod?: string;
    port?: string;
    remark?: string;
}
