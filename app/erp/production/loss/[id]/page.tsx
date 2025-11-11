"use client";

import {
  createProductionLoss,
  deleteProductionLoss,
  getProduction,
  getProductionLoss,
  updateProductionLoss,
} from "@/app/apis/production";
import FormInput from "@/app/components/form-input";
import Modal from "@/app/erp/components/Modal";
import { ProductionInterface } from "@/app/interface/ProductionInterface";
import { ProductionLogInterface } from "@/app/interface/productionLogInterface";
import { ProductionLossInterface } from "@/app/interface/ProductionLossInterface";
import { confirmSwal, errorSwal, successSwal } from "@/app/utils/swalNotify";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Page() {
  const [production, setProduction] = useState<ProductionInterface | null>(
    null
  );
  const [productionLosses, setProductionLosses] = useState<
    ProductionLogInterface[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [remark, setRemark] = useState("");
  const [qty, setQty] = useState(0);
  const [createdAt, setCreatedAt] = useState(new Date());
  const [productionLossId, setProductionLossId] = useState(0);

  const { id } = useParams();

  const fetchProductionLoss = async () => {
    try {
      const response = await getProductionLoss(Number(id));
      if (response.status === 200) {
        setProductionLosses(response.data);
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const fetchProduction = async () => {
    try {
      const response = await getProduction(Number(id));
      if (response.status === 200) {
        setProduction(response.data);
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        production: {
          id: production?.id,
        },
        qty,
        remark,
        createdAt,
      };
      const response =
        productionLossId > 0
          ? await updateProductionLoss(productionLossId, payload)
          : await createProductionLoss(payload);

      if (response.status === 200) {
        setCreatedAt(new Date());
        setQty(0);
        setRemark("");
        setProductionLossId(0);
        await fetchProductionLoss();
        successSwal(
          productionLossId > 0 ? "Edit Successfully" : "Create Successfully"
        );
        setShowModal(false);
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const handleEdit = (productionLoss: ProductionLossInterface) => {
    setShowModal(true);
    setQty(productionLoss.qty);
    setCreatedAt(new Date(productionLoss.createdAt));
    setRemark(productionLoss.remark);
    setProductionLossId(productionLoss.id);
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await confirmSwal(
        "Are you sure to delete?",
        "Delete production loss confirmation"
      );
      if (result.isConfirmed) {
        const response = await deleteProductionLoss(id);
        if (response.status === 200) {
          successSwal("Delete Successfully");
          await fetchProductionLoss();
        }
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProduction();
    fetchProductionLoss();
  }, [id]);

  return (
    <div>
      <h1>Production Loss , Incomplete , Damaged : {production?.name}</h1>
      <div className="flex flex-col gap-3">
        <div>
          <button
            className="btn-add mt-4"
            onClick={() => {
              setShowModal(true);
              setProductionLossId(0);
              setCreatedAt(new Date());
              setRemark("");
              setQty(0);
            }}>
            <i className="fa-solid fa-plus mr-2"></i>Add Data
          </button>
        </div>
        <div className="table-container">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>QTY</th>
                <th>Remark</th>
                <th className="w-[120px]"></th>
              </tr>
            </thead>
            <tbody>
              {productionLosses.map((productionLoss) => (
                <tr key={productionLoss.id}>
                  <td>
                    {new Date(productionLoss.createdAt).toLocaleDateString(
                      "en-GB"
                    )}
                  </td>
                  <td className="text-right">{productionLoss.qty}</td>
                  <td>{productionLoss.remark}</td>
                  <td className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(productionLoss)}
                      className="table-edit-btn table-action-btn">
                      <i className="fa fa-pencil"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(productionLoss.id)}
                      className="table-delete-btn table-action-btn">
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          title={
            productionLossId > 0
              ? "Edit Production Loss"
              : "Create Production Loss"
          }>
          <form className="flex flex-col gap-2" onSubmit={handleSave}>
            <label>Created Date</label>
            <input
              type="date"
              onFocus={(e) => e.target.showPicker()}
              value={createdAt.toISOString().split("T")[0]}
              onChange={(e) => setCreatedAt(new Date(e.target.value))}
            />
            <FormInput
              title="Remark"
              value={remark}
              setValue={setRemark as () => void}
              placeholder=""
              icon=""
            />
            <FormInput
              title="Qty"
              value={qty}
              setValue={setQty as () => void}
              isNumber
              placeholder=""
              icon=""
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="modal-btn modal-btn-cancel">
                <i className="fas fa-times mr-2"></i>
                Cancel
              </button>
              <button type="submit" className="modal-btn modal-btn-submit">
                <i className="fas fa-save mr-2"></i>
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
