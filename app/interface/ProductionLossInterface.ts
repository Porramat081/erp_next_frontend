import { ProductionInterface } from "./ProductionInterface";

export interface ProductionLossInterface {
  id: number;
  production: ProductionInterface;
  qty: number;
  createdAt: Date;
  remark: string;
}
