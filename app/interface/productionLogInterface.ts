import { ProductionInterface } from "./ProductionInterface";

export interface ProductionLogInterface {
  id: number;
  production: ProductionInterface;
  qty: number;
  remark: string;
  createdAt: Date;
}
