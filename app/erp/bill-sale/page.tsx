"use client";

import {
  deleteBillSale,
  getBillSale,
  getBillSaleDetail,
  paidBillSale,
} from "@/app/apis/report";
import { BillSaleInterface } from "@/app/interface/BillSaleInterface";
import { ErrorInterface } from "@/app/interface/ErrorInterface";
import { confirmSwal, errorSwal, successSwal } from "@/app/utils/swalNotify";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { BillSaleDetailInterface } from "@/app/interface/BillSaleDetailInterface";

export default function Page() {
  const [billSale, setBillSale] = useState<BillSaleInterface[]>([]);
  const [billSaleDetails, setBillSaleDetails] = useState<
    BillSaleDetailInterface[]
  >([]);
  const [showModal, setShowModal] = useState(false);

  const fetchBill = async () => {
    try {
      const resonse = await getBillSale();
      if (resonse.status === 200) {
        setBillSale(resonse.data);
      }
    } catch (err) {
      errorSwal((err as ErrorInterface).message);
    }
  };

  const fetchDetail = async (id: number) => {
    try {
      const response = await getBillSaleDetail(id);
      if (response.status === 200) {
        setBillSaleDetails(response.data);
      }
    } catch (err) {
      errorSwal((err as ErrorInterface).message);
    }
  };

  const openModal = async (billId: number) => {
    await fetchDetail(billId);
    setShowModal(true);
  };

  const closeModal = () => {
    setBillSaleDetails([]);
    setShowModal(false);
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await confirmSwal("Are you sure to delete?");
      if (result.isConfirmed) {
        const response = await deleteBillSale(id);
        if (response.status === 200) {
          successSwal("Delete Success", "", 500);
          await fetchBill();
        }
      }
    } catch (err) {
      errorSwal((err as ErrorInterface).message);
    }
  };

  const handlePaid = async (id: number) => {
    try {
      const result = confirmSwal(
        "Are you sure to update?",
        "Change Status to Paid Bill"
      );
      if ((await result).isConfirmed) {
        const response = await paidBillSale(id);
        if (response.status === 200) {
          await fetchBill();
          successSwal("Update status successfully");
        }
      }
    } catch (err) {
      errorSwal((err as ErrorInterface).message);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBill();
  }, []);

  return (
    <div className="container">
      <h1 className="text-2xl font-bold">Sale Billing</h1>
      <div className="table-container">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Status</th>
              <th>Bill No.</th>
              <th>Date</th>
              <th>Total</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {billSale.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.status === "paid" ? (
                    <div className="bg-green-500 text-white px-1 py-1 rounded-xl text-center">
                      <i className="fa fa-check mr-2"></i>Paid
                    </div>
                  ) : (
                    <div className="bg-red-500 text-white px-1 py-1 rounded-xl text-center">
                      <i className="fa fa-check mr-2"></i>Cancel
                    </div>
                  )}
                </td>
                <td>{item.id}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>{item.total}</td>
                <td>
                  <button
                    onClick={() => openModal(item.id)}
                    className="bg-blue-600 px-4 py-2 rounded-md text-white mr-2">
                    <i className="fa fa-file mr-2"></i>Detail
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 px-4 py-2 rounded-md text-white">
                    <i className="fas fa-times mr-2"></i>Cancel
                  </button>
                  <button
                    onClick={() => handlePaid(item.id)}
                    className="bg-green-600 px-4 py-2 rounded-md text-white ml-2">
                    <i className="fa fa-check mr-2"></i>Paid
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <Modal title="Detail Bill Sale" size="2xl" onClose={closeModal}>
          <div className="table-container">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {billSaleDetails.map((billSaleDetail) => (
                  <tr key={billSaleDetail.id}>
                    <td>{billSaleDetail.production.id}</td>
                    <td>{billSaleDetail.production.name}</td>
                    <td>{billSaleDetail.quantity}</td>
                    <td>{billSaleDetail.price.toLocaleString()}</td>
                    <td>
                      {(
                        billSaleDetail.quantity * billSaleDetail.price
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
}
