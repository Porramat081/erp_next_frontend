"use client";

import {
  createMaterial,
  deleteMaterial,
  getMaterials,
  updateMaterial,
} from "@/app/apis/material";
import { Materialinterface } from "@/app/interface/Materialinterace";
import { confirmSwal, errorSwal, successSwal } from "@/app/utils/swalNotify";
import { useState, useEffect, FormEvent } from "react";
import Modal from "../components/Modal";
import FormInput from "@/app/components/form-input";

export default function Page() {
  const [materials, setMaterials] = useState<Materialinterface[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [unitName, setUnitName] = useState("");
  const [qty, setQty] = useState(0);

  const fetchData = async () => {
    try {
      const response = await getMaterials();
      if (response.status === 200) {
        setMaterials(response.data);
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = { name, unitName, qty };
      const response =
        id > 0
          ? await updateMaterial(id, payload)
          : await createMaterial(payload);
      if (response.status === 200) {
        successSwal(
          id > 0 ? "Edit Successfully" : "Create Successfully",
          "",
          1000
        );
        await fetchData();
        setShowModal(false);
        setName("");
        setId(0);
        setUnitName("");
        setQty(0);
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const handleEdit = (material: Materialinterface) => {
    setId(material.id);
    setName(material.name);
    setUnitName(material.unitName);
    setQty(material.qty);
    setShowModal(true);
  };

  const handleAdd = () => {
    setName("");
    setId(0);
    setUnitName("");
    setQty(0);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await confirmSwal(
        "Are you sure to delete?",
        "Delete Confirmation"
      );
      if (result.isConfirmed) {
        const response = await deleteMaterial(id);

        if (response.status === 200) {
          successSwal("Delete Material Successfully", "", 1000);
          await fetchData();
          setShowModal(false);
        }
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
      <h1 className="text-2xl font-bold mb-5">Material</h1>
      <button onClick={handleAdd} className="button">
        <i className="fas fa-plus mr-2"></i>Add Material
      </button>
      <div className="table-container mt-5">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th className="w-[120px]">Unit</th>
              <th className="w-[120px]">Qty</th>
              <th className="w-[120px]"></th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => (
              <tr key={material.id}>
                <td>{material.name}</td>
                <td>{material.unitName}</td>
                <td>{material.qty}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => handleEdit(material)}
                    className="table-edit-btn table-action-btn">
                    <i className="fas fa-pencil"></i>
                  </button>
                  <button
                    className="table-delete-btn table-action-btn"
                    onClick={() => handleDelete(material.id)}>
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
          title={id > 0 ? "Edit Material" : "Create Material"}
          onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave}>
            <FormInput
              title="Name"
              value={name}
              setValue={setName as () => void}
              placeholder=""
              icon=""
            />
            <FormInput
              title="Unit"
              value={unitName}
              setValue={setUnitName as () => void}
              placeholder=""
              icon=""
            />
            <FormInput
              title="Qty"
              isNumber
              value={qty as number}
              setValue={setQty as () => void}
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
