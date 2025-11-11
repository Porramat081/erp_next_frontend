"use client";

import { getReports } from "@/app/apis/report";
import { ErrorInterface } from "@/app/interface/ErrorInterface";
import { ReportIncomePerMonthInterface } from "@/app/interface/ReportIncomePerMonthInterface";
import { errorSwal } from "@/app/utils/swalNotify";
import { useEffect, useState } from "react";

export default function Page() {
  const [report, setReport] = useState<ReportIncomePerMonthInterface[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [arrYear, setArrYear] = useState<number[]>([]);

  const fetchArrYear = () => {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 5;
    const arrYear = [];

    for (let i = lastYear; i <= currentYear; i++) {
      arrYear.push(i);
    }
    setArrYear(arrYear);
  };

  const fecthData = async () => {
    try {
      const response = await getReports(year);
      if (response.status === 200) {
        setReport(response.data);
      }
    } catch (err) {
      errorSwal((err as ErrorInterface).message);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchArrYear();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fecthData();
  }, [year]);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">Report Income Per Month</h1>
      <div className="flex gap-2 mt-5">
        <label>Year</label>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {arrYear.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table className="table table-bordered w-full">
          <thead>
            <tr>
              <th>Month</th>
              <th style={{ textAlign: "right" }}>Sale Count</th>
            </tr>
          </thead>
          <tbody>
            {report.map((item) => (
              <tr key={item.month}>
                <td>{item.month}</td>
                <td className="text-right">
                  {item.income.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
