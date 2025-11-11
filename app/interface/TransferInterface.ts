import { ProductionInterface } from "./ProductionInterface";
import { StockInterface } from "./StockInterface";

export interface TransferInterface {
  id: number;
  fromStock: StockInterface;
  toStock: StockInterface;
  production: ProductionInterface;
  quantity: number;
  remark: string;
  createdAt: Date;
}
