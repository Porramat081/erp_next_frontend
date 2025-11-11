"use client";

import { getDashboard } from "@/app/apis/report";
import { ErrorInterface } from "@/app/interface/ErrorInterface";
import { errorSwal } from "@/app/utils/swalNotify";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [totalQty, setTotalQty] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalLoss, setTotalLoss] = useState(0);

  const fetchData = async () => {
    try {
      const response = await getDashboard();
      if (response.status === 200) {
        setTotalQty(response.data.sumQTY);
        setTotalIncome(response.data.sumIncome);
        setTotalProduct(response.data.totalProduction);
        setTotalLoss(response.data.sumLoss);
      }
    } catch (err) {
      errorSwal((err as ErrorInterface).message);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  return (
    <>
      <div className="text-2xl font-bold mb-2">Dashboard</div>
      <div className="flex gap-2">
        <div className="flex flex-col gap-2 bg-blue-400 text-white rounded-lg p-2 w-full">
          <div>{"Production (Qty)"}</div>
          <div>{totalQty}</div>
        </div>
        <div className="flex flex-col gap-2 bg-green-700 text-white rounded-lg p-2 w-full">
          <div>{"Sale (Qty)"}</div>
          <div>{totalIncome}</div>
        </div>
        <div className="flex flex-col gap-2 bg-yellow-500 text-white rounded-lg p-2 w-full">
          <div>{"Remain (Qty)"}</div>
          <div>{totalProduct}</div>
        </div>
        <div className="flex flex-col gap-2 bg-red-500 text-white rounded-lg p-2 w-full">
          <div>{"Loss (Qty)"}</div>
          <div>{totalLoss}</div>
        </div>
      </div>
    </>
  );
}
