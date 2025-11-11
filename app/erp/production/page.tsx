"use client";

import {
  createProduction,
  deleteProduction,
  editProduction,
  getProductions,
} from "@/app/apis/production";
import { ProductionInterface } from "@/app/interface/ProductionInterface";
import { confirmSwal, errorSwal, successSwal } from "@/app/utils/swalNotify";
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import FormInput from "@/app/components/form-input";
import Link from "next/link";

export default function Page() {
  const [productions, setProductions] = useState<ProductionInterface[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduction, setEditingProduction] =
    useState<ProductionInterface | null>(null);

  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");

  const fetchData = async () => {
    try {
      const response = await getProductions();
      if (response.status === 200) {
        setProductions(response.data);
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const handleAdd = () => {
    setEditingProduction(null);
    setName("");
    setDetail("");
    setShowModal(true);
  };

  const handleEdit = (production: ProductionInterface) => {
    setEditingProduction(production);
    setName(production.name);
    setDetail(production.detail);
    setShowModal(true);
  };

  const handleDelete = async (production: ProductionInterface) => {
    try {
      const result = await confirmSwal(
        "Are you sure to delete : " + production.name + " ?",
        "Delete Confirmation"
      );
      if (result.isConfirmed) {
        const response = await deleteProduction(production.id);
        if (response.status === 200) {
          successSwal("Delete Sucessfully", "", 1000);
          await fetchData();
        }
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { name, detail };
      const response = editingProduction
        ? await editProduction(editingProduction.id, payload)
        : await createProduction(payload);

      if (response.status === 200) {
        successSwal(
          editingProduction ? "Edit Successfully" : "Create Successfully",
          "",
          1000
        );
        setShowModal(false);
        await fetchData();
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-5">Production Management</h1>
      <div className="flex mb-6 gap-2">
        <button className="btn-add" onClick={handleAdd}>
          <i className="fas fa-plus mr-2"></i>
          Add Production
        </button>
        <Link href={"/erp/material"} className="button">
          <i className="fas fa-box mr-2"></i>
          Material
        </Link>
      </div>
      <div className="table-container">
        <table className="table w-full">
          <thead>
            <tr className="grid grid-cols-10 w-full">
              <th className="col-span-2">Name</th>
              <th className="col-span-3">Detail</th>
              <th className="col-span-5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productions.map((production) => (
              <tr key={production.id} className="grid grid-cols-10 w-full">
                <td className="col-span-2">{production.name}</td>
                <td className="col-span-3">{production.detail}</td>
                <td className="flex gap-2 col-span-5 overflow-auto">
                  <Link
                    href={"/erp/formular/" + production.id}
                    className="button">
                    <i className="fas fa-file-alt mr-2"></i>
                    Formular
                  </Link>
                  <Link
                    href={"/erp/production/log/" + production.id}
                    className="button">
                    <i className="fas fa-check mr-2"></i>
                    Check Production
                  </Link>
                  <Link
                    href={"/erp/production/loss/" + production.id}
                    className="button">
                    <i className="fas fa-file-alt mr-2"></i>
                    Check Loss
                  </Link>
                  <button
                    className="table-action-btn table-edit-btn"
                    onClick={() => handleEdit(production)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="table-action-btn table-delete-btn"
                    onClick={() => handleDelete(production)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <Modal
          id="production-modal"
          title={editingProduction ? "Edit Production" : "Create Production"}
          onClose={() => setShowModal(false)}
          size="md">
          <form onSubmit={handleSubmit}>
            <FormInput
              title="Name"
              value={name}
              setValue={setName as () => void}
              placeholder=""
              icon=""
            />
            <FormInput
              title="Detail"
              value={detail}
              setValue={setDetail as () => void}
              placeholder=""
              icon=""
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                className="modal-btn modal-btn-cancel"
                type="button"
                onClick={() => setShowModal(false)}>
                <i className="fas fa-times mr-2"></i>
                Cancel
              </button>
              <button type="submit" className="modal-btn modal-btn-submit">
                <i className="fas fa-check mr-2"></i>
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
