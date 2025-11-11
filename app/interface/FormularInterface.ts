import { Materialinterface } from "./Materialinterace";
import { ProductionInterface } from "./ProductionInterface";

export interface FormularInterface {
  id: number;
  unit: string;
  qty: number;
  material: Materialinterface;
  production: ProductionInterface;
}
