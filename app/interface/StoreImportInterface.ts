import { ProductionInterface } from "./ProductionInterface";
import { StockInterface } from "./StockInterface";

export interface StoreImportInterface {
  id: number;
  importDate: Date;
  qty: number;
  remark: string;
  stock: StockInterface;
  production: ProductionInterface;
}
