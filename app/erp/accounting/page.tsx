"use client";

import { getProductions, updatePrice } from "@/app/apis/production";
import { ErrorInterface } from "@/app/interface/ErrorInterface";
import { ProductionInterface } from "@/app/interface/ProductionInterface";
import { errorSwal, successSwal } from "@/app/utils/swalNotify";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";

export default function Page() {
  const [production, setProduction] = useState<ProductionInterface[]>([]);
  const [selectedProduction, setSelectedProduction] =
    useState<ProductionInterface | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);

  const fetchDataProduction = async () => {
    try {
      const response = await getProductions();
      if (response.status === 200) {
        setProduction(response.data);
      }
    } catch (err) {
      errorSwal((err as ErrorInterface).message);
    }
  };

  const openModal = (id: number) => {
    const selectedProduction = production.find((item) => item.id === id);
    if (selectedProduction) {
      setSelectedProduction(selectedProduction);
      setPrice(selectedProduction.currentPrice);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedProduction(null);
    setPrice(0);
    setShowModal(false);
  };

  const handleSavePrice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (selectedProduction) {
        const payload = {
          ...selectedProduction,
          currentPrice: price,
        };
        const response = await updatePrice(payload);
        if (response.status === 200) {
          successSwal("Update Successfully");
          await fetchDataProduction();
        }
      }
    } catch (err) {
      errorSwal((err as ErrorInterface).message);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDataProduction();
  }, []);
  return (
    <div className="container">
      <div>
        <h1 className="text-2xl font-bold">Accounting Page</h1>
        <div>
          <h2 className="font-bold">Production Price Setting</h2>
          <div className="table-container">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th className="w-[100px]" style={{ textAlign: "right" }}>
                    Price
                  </th>
                  <th className="w-[140px]">Edit Price</th>
                </tr>
              </thead>
              <tbody>
                {production.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td className="text-right">{item.currentPrice || 0}</td>
                    <td className="flex justify-center">
                      <button
                        onClick={() => openModal(item.id)}
                        className="table-edit-btn table-action-btn">
                        <i className="fa fa-pencil"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal size="lg" title={"Edit Price"} onClose={closeModal}>
          <form onSubmit={handleSavePrice} className="flex flex-col gap-4">
            <div>
              <label>Product Name</label>
              <input type="text" disabled value={selectedProduction?.name} />
            </div>
            <div>
              <label>Product Price</label>
              <input
                value={price}
                type="number"
                onChange={(e) => setPrice(Number(e.target.value ?? 0))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="modal-btn modal-btn-cancel"
                onClick={closeModal}>
                <i className="fas fa-times mr-2"></i>Cancel
              </button>
              <button type="submit" className="modal-btn modal-btn-submit">
                <i className="fas fa-check mr-2"></i>Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
