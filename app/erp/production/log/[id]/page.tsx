"use client";

import {
  createProductionLog,
  deleteProductionLog,
  getProduction,
  getProductionLog,
  updateProductionLog,
} from "@/app/apis/production";
import FormInput from "@/app/components/form-input";
import Modal from "@/app/erp/components/Modal";
import { ProductionInterface } from "@/app/interface/ProductionInterface";
import { ProductionLogInterface } from "@/app/interface/productionLogInterface";
import { confirmSwal, errorSwal, successSwal } from "@/app/utils/swalNotify";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function ProductionLog() {
  const [production, setProduction] = useState<ProductionInterface | null>(
    null
  );
  const [productionLogs, setProductionLogs] = useState<
    ProductionLogInterface[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [remark, setRemark] = useState("");
  const [qty, setQty] = useState(0);
  const [createdAt, setCreatedAt] = useState(new Date());
  const [productionLogId, setProductionLogId] = useState(0);

  const { id } = useParams();

  const fetchProductionLogs = async () => {
    try {
      const response = await getProductionLog(Number(id));
      if (response.status === 200) {
        setProductionLogs(response.data);
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
        createdAt: createdAt,
        qty,
        remark,
        production: {
          id,
        },
      };
      const response = productionLogId
        ? await updateProductionLog(productionLogId, payload)
        : await createProductionLog(payload);

      if (response.status === 200) {
        successSwal(
          productionLogId
            ? "Update Log Successfully"
            : "Create Log Successfully"
        );
        if (productionLogId > 0) {
          setProductionLogId(0);
        }
        setQty(0);
        setRemark("");
        setCreatedAt(new Date());
        await fetchProductionLogs();
        setShowModal(false);
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await confirmSwal(
        "Are you sure to delete?",
        "Delete Log Confirmation"
      );
      if (result.isConfirmed) {
        const response = await deleteProductionLog(id);
        if (response.status === 200) {
          successSwal("Delete Successfully");
        }
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const handleEdit = (productionLog: ProductionLogInterface) => {
    setShowModal(true);
    setProductionLogId(productionLog.id);
    setQty(productionLog.qty);
    setRemark(productionLog.remark);
    setCreatedAt(new Date(productionLog.createdAt));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProductionLogs();
    fetchProduction();
  }, [id]);

  return (
    <div className="container">
      <h1 className="text-2xl font-bold">
        Production Log : {production?.name}
      </h1>
      <div className="flex flex-col mt-3 gap-3">
        <div>
          <button className="btn-add" onClick={() => setShowModal(true)}>
            <i className="fa-solid fa-plus mr-2"></i>
            Add Log
          </button>
        </div>
        <div className="table-container">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th className="text-right">Qty</th>
                <th>Remark</th>
                <th className="w-[120px]"></th>
              </tr>
            </thead>
            <tbody>
              {productionLogs.length > 0 &&
                productionLogs.map((productionLog) => (
                  <tr key={productionLog.id}>
                    <td>
                      {new Date(productionLog.createdAt).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    <td className="text-right">{productionLog.qty}</td>
                    <td>{productionLog.remark}</td>
                    <td className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(productionLog)}
                        className="table-edit-btn table-action-btn">
                        <i className="fa fa-pencil"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(productionLog.id)}
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
            productionLogId ? "Edit Production Log" : "Create Production Log"
          }>
          <form className="flex flex-col gap-3" onSubmit={handleSave}>
            <div>
              <label>Created Date</label>
              <input
                type="date"
                onFocus={(e) => e.target.showPicker()}
                value={createdAt.toISOString().split("T")[0]}
                onChange={(e) => setCreatedAt(new Date(e.target.value))}
              />
            </div>
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
