import { UserInterface } from "./UserInterface";

export interface BillSaleInterface {
  id: number;
  user: UserInterface;
  inputMoney: number;
  discount: number;
  total: number;
  status: string;
  createdAt: Date;
}
