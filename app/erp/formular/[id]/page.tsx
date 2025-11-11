"use client";

import { getProduction } from "@/app/apis/production";
import { FormularInterface } from "@/app/interface/FormularInterface";
import { Materialinterface } from "@/app/interface/Materialinterace";
import { ProductionInterface } from "@/app/interface/ProductionInterface";
import { confirmSwal, errorSwal, successSwal } from "@/app/utils/swalNotify";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import FormInput from "@/app/components/form-input";
import { getMaterials } from "@/app/apis/material";
import {
  createFormular,
  deleteFormular,
  getFormulars,
} from "@/app/apis/formular";

export default function Page() {
  const [formulars, setFormulars] = useState<FormularInterface[] | null>([]);
  const [production, setProduction] = useState<ProductionInterface | null>(
    null
  );
  const [materials, setMaterials] = useState<Materialinterface[] | null>([]);
  const [materialId, setMaterialId] = useState(0);
  const [qty, setQty] = useState(0);
  const [unit, setUnit] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();

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

  const fetchMaterial = async () => {
    try {
      const response = await getMaterials();
      if (response.status === 200) {
        setMaterials(response.data);
        setMaterialId(response.data[0].id);
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const fetchFormulars = async () => {
    try {
      const response = await getFormulars(Number(id));
      if (response.status === 200) {
        setFormulars(response.data);
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProduction();
      fetchMaterial();
      fetchFormulars();
    }
  }, [id]);

  const handleAdd = () => {
    setQty(0);
    setUnit("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        qty,
        unit,
        production: {
          id: production?.id,
        },
        material: {
          id: materialId,
        },
      };
      const response = await createFormular(payload);
      if (response.status === 200) {
        setQty(0);
        setUnit("");
        successSwal("Add Formular Successfully");
        await fetchFormulars();
        setShowModal(false);
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await confirmSwal(
        "Are you sure to delete ?",
        "Delete Confirmation"
      );

      if (result.isConfirmed) {
        const response = await deleteFormular(id);
        if (response.status === 200) {
          successSwal("Delete Successfully");
          await fetchFormulars();
        }
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  return (
    <div className="container">
      <h1 className="text-2xl font-bold">Formular of {production?.name}</h1>
      <div className="mt-4">
        <button className="btn-add" onClick={handleAdd}>
          <i className="fas fa-plus mr-2"></i>
          Add Formular
        </button>
      </div>
      <div className="flex flex-col gap-2 mt-3">
        <div className="table-container">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Material</th>
                <th className="w-[100px] text-right">Qty</th>
                <th className="w-[100px]">Unit</th>
                <th className="w-[50px]"></th>
              </tr>
            </thead>
            <tbody>
              {formulars?.map((formular) => (
                <tr key={formular.id}>
                  <td>{formular.material.name}</td>
                  <td>{formular.qty}</td>
                  <td>{formular.unit}</td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDelete(formular.id)}
                      className="table-action-btn table-delete-btn">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)} title="Add Formular">
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="flex gap-2 items-center">
              <label htmlFor="material">Material</label>
              <select
                id="material"
                value={materialId}
                onChange={(e) => setMaterialId(Number(e.target.value))}>
                {materials?.map((material) => (
                  <option value={material.id} key={material.id}>
                    {material.name}
                  </option>
                ))}
              </select>
            </div>
            <FormInput
              title="qty"
              value={qty}
              setValue={setQty as () => void}
              isNumber
              placeholder=""
              icon=""
            />
            <FormInput
              title="unit"
              value={unit}
              setValue={setUnit as () => void}
              placeholder=""
              icon=""
            />
            <div className="flex justify-end mt-2">
              <button className="btn-add">
                <i className="fas fa-check mr-2"></i>Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
