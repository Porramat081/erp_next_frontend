import { BillSaleInterface } from "./BillSaleInterface";
import { ProductionInterface } from "./ProductionInterface";

export interface BillSaleDetailInterface {
  id: number;
  production: ProductionInterface;
  quantity: number;
  price: number;
  billSale: BillSaleInterface;
}
