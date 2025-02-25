// 产品基本信息接口
interface Product {
  id: string;                         // 序列
  tccode?: string;                    // 产品代码
  supplier?: string;                  // 供应商
  supplierCode?: string;             // 供应商代码
  supplierName?: string;             // 供应商名称
  fireStandard?: string;             // 防火标准
  fob20ContainerPrice?: number;      // 20尺柜FOB价格
  fob40ContainerPrice?: number;      // 40尺柜FOB价格
  shippingPort?: string;             // 发货港口
}

// 产品包装信息接口
interface CartonDetail {
  id: string;                       // 序列
  productId: string;                // 产品ID
  width?: number;                   // 包装箱宽度(mm)
  depth?: number;                   // 包装箱深度(mm)
  height?: number;                  // 包装箱高度(mm)
  boardType?: string;              // 纸板类型
  itemsPerCarton?: number;         // 每箱数量
  cartonVolume?: number;           // 箱体体积(m³)
}

// 产品尺寸信息接口
interface ProductDimension {
  id: string;                      // 序列
  productId: string;               // 产品ID
  seatWidth?: number;              // 座位宽度(mm)
  seatDepth?: number;              // 座位深度(mm)
  seatHeightMin?: number;          // 座位最小高度(mm)
  seatHeightMax?: number;          // 座位最大高度(mm)
  backWidth?: number;              // 靠背宽度(mm)
  backHeight?: number;             // 靠背高度(mm)
  backHeightFromSeat?: number;     // 靠背高度从座位(mm)
  overallWidth?: number;           // 整体宽度(mm)
  overallDepth?: number;           // 整体深度(mm)
  overallHeightMin?: number;       // 整体最小高度(mm)
  overallHeightMax?: number;       // 整体最大高度(mm)
}

// 生产物流信息接口
interface ProductionLogistics {
  id: string;                      // 序列
  productId: string;               // 产品ID
  productionTime?: number;         // 生产时间(天)
  effectiveVolume?: number;        // 有效体积(m³)
  loadingQuantity20gp?: number;    // 20尺标准柜装载数量
  loadingQuantity40hc?: number;    // 40尺高柜装载数量
  netWeight?: number;              // 净重(kg)
  grossWeight?: number;            // 毛重(kg)
}

// 座椅内部组件接口
interface SeatInnerComponent {
  id: string;                      // 序列
  productId: string;               // 产品ID
  materialCode?: string;           // 材料代码
  thickness?: number;              // 厚度(mm)
  layersCount?: number;           // 层数
  dimensions?: string;             // 尺寸规格
}

// 座椅外部组件接口
interface SeatOuterComponent {
  id: string;                      // 序列
  productId: string;               // 产品ID
  material?: string;               // 材料
  dimensions?: string;             // 尺寸(宽x深/宽x高)
  manufacturerName?: string;       // 制造商名称
}

// 靠背内部组件接口
interface BackInnerComponent {
  id: string;                      // 序列
  productId: string;               // 产品ID
  materialCode?: string;           // 材料代码
  thickness?: number;              // 厚度(mm)
  layersCount?: number;           // 层数
  dimensions?: string;             // 尺寸规格
}

// 靠背外部组件接口
interface BackOuterComponent {
  id: string;                      // 序列
  productId: string;               // 产品ID
  material?: string;               // 材料
  dimensions?: string;             // 尺寸(宽x深/宽x高)
  manufacturerName?: string;       // 制造商名称
}

// 扶手信息接口
interface Arm {
  id: string;                      // 序列
  productId: string;               // 产品ID
  material?: string;               // 材料
  type?: string;                   // 类型
  manufacturer?: string;           // 制造商
  description?: string;            // 描述
  armHeightFromSeat?: number;      // 扶手距座面高度(mm)
  armHeightFromFloor?: number;     // 扶手距地面高度(mm)
}

// 海绵详情接口
interface FoamDetail {
  id: string;                      // 序列
  productId: string;               // 产品ID
  description?: string;            // 描述
  seatDensity?: number;           // 座椅密度(kg/m³)
  backDensity?: number;           // 靠背密度(kg/m³)
  seatThickness?: number;         // 座椅厚度(mm)
  backThickness?: number;         // 靠背厚度(mm)
}

// 脚轮信息接口
interface Castor {
  id: string;                      // 序列
  productId: string;               // 产品ID
  description?: string;            // 描述
  pinThickness?: number;          // 销轴直径(mm)
  wheelDiameter?: number;         // 轮子直径(mm)
}

// 底座信息接口
interface Base {
  id: string;                      // 序列
  productId: string;               // 产品ID
  description?: string;            // 描述
  sizeDiameter?: number;          // 底盘直径(mm)
  material?: string;               // 材料
  type?: string;                   // 类型
}

// 气压棒信息接口
interface GasLift {
  id: string;                      // 序列
  productId: string;               // 产品ID
  description?: string;            // 描述
  gasLiftClass?: string;          // 气压等级
  casingLength?: number;          // 外管长度(mm)
  extensionSize?: number;         // 行程(mm)
  taper?: number;                 // 锥度(mm)
}

// 气压棒护罩接口
interface GasLiftCover {
  id: string;                      // 序列
  productId: string;               // 产品ID
  description?: string;            // 描述
  material?: string;               // 材料
  colour?: string;                 // 颜色
}

// 机构信息接口
interface Mechanism {
  id: string;                      // 序列
  productId: string;               // 产品ID
  description?: string;            // 描述
  leversCount?: number;           // 手柄数量
  lockingPositions?: string;      // 锁定位置
  modelNo?: string;               // 型号
  supplierName?: string;          // 机构供应商
}

// 配件信息接口
interface Fitting {
  id: string;                      // 序列
  productId: string;               // 产品ID
  fittingNumber?: number;         // 配件编号
  description?: string;            // 描述
  quantity?: number;               // 数量
  material?: string;               // 材料
}

// 产品图片信息接口
interface ProductImage {
  id: string;                  // 序列
  prodId: string;             // 规格表ID
  frontImgPath?: string;      // 正视图路径
  sideImgPath?: string;       // 侧视图路径
  backImgPath?: string;       // 背视图路径
  angleImgPath?: string;      // 角视图路径
}

// 面料信息接口
interface Upholstery {
  id: string;                        // 序列
  productId: string;                 // 产品ID
  fabricManufacturer?: string;      // 面料制造商
  colourCode?: string;              // 颜色代码
  leatherGrade?: string;            // 皮革等级
  usagePerChair?: number;           // 每把椅子用料(m²)
}

// 产品查询参数接口
interface ProductParams {
  page?: number;
  size?: number;
  keyword?: string;
}

// 产品详情数据传输对象接口
export interface ProductDTO {
  id?: string | number;
  tccode?: string;
  supplier?: string;
  supplier_code?: string;
  supplier_name?: string;
  fire_standard?: string;
  fob_20_container_price?: string | number;
  fob_40_container_price?: string | number;
  shipping_port?: string;
  // 基本信息
  products: Product;
  // 包装信息
  cartonDetails: CartonDetail;
  // 产品尺寸
  productDimensions: ProductDimension;
  // 生产物流
  productionLogistics: ProductionLogistics;
  // 座椅内部组件
  seatInnerComponents: SeatInnerComponent;
  // 座椅外部组件
  seatOuterComponents: SeatOuterComponent;
  // 靠背内部组件
  backInnerComponents: BackInnerComponent;
  // 靠背外部组件
  backOuterComponents: BackOuterComponent;
  // 扶手信息
  arms: Arm;
  // 海绵详情
  foamDetails: FoamDetail;
  // 脚轮信息
  castors: Castor;
  // 底座信息
  bases: Base;
  // 气压棒
  gasLift: GasLift;
  // 气压棒护罩
  gasLiftCover: GasLiftCover;
  // 机构信息
  mechanism: Mechanism;
  // 配件信息
  fittings: Fitting;
  // 产品图片
  productImages: ProductImage;
  // 面料信息
  upholstery: Upholstery;
}

export {
  Product,
  CartonDetail,
  ProductDimension,
  ProductionLogistics,
  SeatInnerComponent,
  SeatOuterComponent,
  BackInnerComponent,
  BackOuterComponent,
  Arm,
  FoamDetail,
  Castor,
  Base,
  GasLift,
  GasLiftCover,
  Mechanism,
  Fitting,
  ProductImage,
  Upholstery,
  ProductDTO,
  ProductParams
}