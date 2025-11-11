"use client";

import { getProductions } from "@/app/apis/production";
import { ErrorInterface } from "@/app/interface/ErrorInterface";
import { ProductionInterface } from "@/app/interface/ProductionInterface";
import { confirmSwal, errorSwal, successSwal } from "@/app/utils/swalNotify";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import {
  createSaleTemp,
  deleteSaleTemp,
  editQtySaleTemp,
  endSale,
  getSaleTemp,
} from "@/app/apis/sale";
import { SaleTempInterface } from "@/app/interface/SaleTempInterface";

export default function Page() {
  const [productions, setProductions] = useState<ProductionInterface[]>([]);
  const [total, setTotal] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [saleTemps, setSaleTemps] = useState<SaleTempInterface[]>([]);
  const [showModalProduction, setShowModalProduction] = useState(false);

  const [showModalEndSale, setShowModalEndSale] = useState(false);
  const [inputMoney, setInputMoney] = useState(0);
  const [returnMoney, setReturnMoney] = useState(0);

  const fetchProductions = async () => {
    try {
      const response = await getProductions();
      if (response.status === 200) {
        setProductions(response.data);
      }
    } catch (err) {
      errorSwal((err as ErrorInterface).message);
    }
  };

  const fetchDataSaleTemp = async () => {
    try {
      const response = await getSaleTemp();
      if (response.status === 200) {
        setSaleTemps(response.data);
      }
    } catch (err) {
      errorSwal((err as ErrorInterface).message);
    }
  };

  const openModal = () => {
    setShowModalProduction(true);
  };

  const closeModal = () => {
    setShowModalProduction(false);
  };

  const handleChooseProduction = async (production: ProductionInterface) => {
    try {
      const response = await createSaleTemp(production.id);
      if (response.status === 200) {
        await fetchDataSaleTemp();
        closeModal();
      }
    } catch (err) {
      errorSwal((err as ErrorInterface).message);
    }
  };

  const handleDeleteSaleTemp = async (id: number) => {
    try {
      const result = await confirmSwal(
        "Are you sure to delete?",
        "Delete Confirmation"
      );
      if (result.isConfirmed) {
        const response = await deleteSaleTemp(id);
        if (response.status === 200) {
          await fetchDataSaleTemp();
        }
      }
    } catch (err) {
      errorSwal((err as ErrorInterface).message);
    }
  };

  const handleQty = async (id: number, quantity: number, isUp: boolean) => {
    try {
      if (!isUp && quantity - 1 < 1) {
        return;
      }
      const response = await editQtySaleTemp(id, quantity, isUp);
      if (response.status === 200) {
        await fetchDataSaleTemp();
      }
    } catch (err) {
      errorSwal((err as ErrorInterface).message);
    }
  };

  const openModalEndSale = () => {
    setShowModalEndSale(true);
  };

  const closeModalEndSale = () => {
    setShowModalEndSale(false);
  };

  const handleChangeInputMoney = (
    e: React.ChangeEvent<HTMLInputElement>,
    isDiscount: boolean
  ) => {
    const value = e.target.value;
    const doubleValue = Number(value);

    if (!isNaN(doubleValue)) {
      if (isDiscount) {
        setDiscount(doubleValue);
      } else {
        setInputMoney(doubleValue);
      }
    }
  };

  const handleFullPay = () => {
    setInputMoney(total - discount);
  };

  const handleEndSale = async () => {
    try {
      const result = await confirmSwal("Confirm End Sale");
      if (result.isConfirmed) {
        const payload = {
          inputMoney,
          discount,
          total,
        };
        const response = await endSale(payload);
        if (response.status === 200) {
          await fetchDataSaleTemp();
          successSwal("Create Sale Record Successfully");
          closeModalEndSale();
        }
      } else {
        openModalEndSale();
      }
    } catch (err) {
      errorSwal((err as ErrorInterface).message);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProductions();
    fetchDataSaleTemp();
  }, []);

  useEffect(() => {
    const initTotal = saleTemps.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
    const initQty = saleTemps.reduce((acc, item) => acc + item.qty, 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTotal(initTotal);
    setQuantity(initQty);
  }, [saleTemps]);

  useEffect(() => {
    setReturnMoney(inputMoney + discount - total);
  }, [inputMoney, total, discount]);

  return (
    <div className="container">
      <h1 className="text-2xl font-bold">Sale Page</h1>
      <div className="flex justify-end">
        <span className="text-2xl font-bold bg-gray-950 px-4 py-2 rounded-md text-green-300 border border-green-300">
          {total.toLocaleString("th-TH", {
            minimumFractionDigits: 2,
          })}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            className="form-input"
            type="text"
            placeholder="Enter Product ID"
          />
          <button className="button" onClick={openModal}>
            <i className="fa fa-search mr-2"></i>Search
          </button>
        </div>
        <div className="flex justify-end">
          <button className="button" onClick={openModalEndSale}>
            <i className="fa-solid fa-check"></i>Finish Sale
          </button>
        </div>
        <div className="table-container">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th className="w-[60px]">Manage</th>
              </tr>
            </thead>
            <tbody>
              {saleTemps.map((saleTemp) => (
                <tr key={saleTemp.id}>
                  <td>{saleTemp.production.id}</td>
                  <td>{saleTemp.production.name}</td>
                  <td>{saleTemp.price}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleQty(saleTemp.id, saleTemp.qty, false)
                        }
                        className="table-delete-btn table-action-btn">
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <span className="font-bold">{saleTemp.qty}</span>
                      <button
                        onClick={() =>
                          handleQty(saleTemp.id, saleTemp.qty, true)
                        }
                        className="table-edit-btn table-action-btn">
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </td>
                  <td>{saleTemp.price * saleTemp.qty}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="table-delete-btn table-action-btn"
                        onClick={() => handleDeleteSaleTemp(saleTemp.id)}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-3">
          Sold Item :<span className="font-bold">{saleTemps.length}</span>
          Total Quantity :<span className="font-bold">{quantity}</span>
        </div>
      </div>
      {showModalProduction && (
        <Modal size="xl" title="Production" onClose={closeModal}>
          <div className="table-container">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>selected</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {productions.map((production) => (
                  <tr key={production.id}>
                    <td>
                      <button
                        className="button"
                        onClick={() => handleChooseProduction(production)}>
                        <i className="fa-solid fa-check mr-2"></i>Select
                      </button>
                    </td>
                    <td>{production.id}</td>
                    <td>{production.name}</td>
                    <td>{production.currentPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
      {showModalEndSale && (
        <Modal size="xl" title="End Sale Modal" onClose={closeModalEndSale}>
          <div className="flex flex-col gap-2">
            <div>
              <div className="text-2xl font-bold text-right mb-2 text-gray-500">
                Total Amount
              </div>
              <input
                type="text"
                value={total.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                })}
                disabled
                className="text-right text-4xl font-bold"
              />
            </div>
            <div>
              <div className="text-2xl font-bold text-right mb-2 text-gray-500">
                Input Money
              </div>
              <input
                type="text"
                value={inputMoney}
                onChange={(e) => handleChangeInputMoney(e, false)}
                className="text-right text-4xl font-bold bg-blue-400/20! text-blue-500!"
              />
            </div>
            <div>
              <div className="text-2xl font-bold text-right mb-2 text-gray-500">
                discount
              </div>
              <input
                type="text"
                value={discount}
                onChange={(e) => handleChangeInputMoney(e, true)}
                className="text-right text-4xl font-bold bg-red-500/20!"
              />
            </div>
            <div>
              <div className="text-2xl font-bold text-right mb-2 text-gray-500">
                Return Money
              </div>
              <input
                type="number"
                value={(returnMoney > 0 && returnMoney) || 0}
                disabled
                className="text-right text-4xl font-bold bg-yellow-400/20!"
              />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={handleFullPay} className="button text-2xl">
                <i className="fa-solid fa-check mr-2"></i>
                Full Pay
              </button>
              <button onClick={handleEndSale} className="button text-2xl">
                <i className="fa-solid fa-check mr-2"></i>
                Finish Sale
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
