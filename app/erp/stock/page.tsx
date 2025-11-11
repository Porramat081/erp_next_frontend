"use client";

import {
  createStock,
  deleteImportHistory,
  deleteStock,
  getDataImport,
  getImportHistory,
  getStocks,
  getTransferStock,
  importProductToStock,
  createTransferStock,
  updateStock,
  deleteTransferStock,
} from "@/app/apis/stock";
import { StockInterface } from "@/app/interface/StockInterface";
import { confirmSwal, errorSwal, successSwal } from "@/app/utils/swalNotify";
import { FormEvent, useEffect, useState } from "react";
import Modal from "../components/Modal";
import FormInput from "@/app/components/form-input";
import { ProductionInterface } from "@/app/interface/ProductionInterface";
import { getProductions } from "@/app/apis/production";
import { StoreImportInterface } from "@/app/interface/StoreImportInterface";
import { TransferInterface } from "@/app/interface/TransferInterface";

export default function Page() {
  const [stocks, setStocks] = useState<StockInterface[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [remark, setRemark] = useState("");
  const [address, setAddress] = useState("");
  const [production, setProduction] = useState<ProductionInterface[]>([]);
  const [productionId, setProductionId] = useState(0);

  const [stockId, setStockId] = useState(0);

  const [showModalImport, setShowModalImport] = useState(false);
  const [showModalHistory, setShowModalHistory] = useState(false);
  const [storeImport, setStoreImport] = useState<StoreImportInterface[]>([]);

  const [showModalTransfer, setShowModalTransfer] = useState(false);
  const [fromStoreId, setFromStoreId] = useState(0);
  const [fromStockName, setFromStockName] = useState("");
  const [toStoreId, setToStoreId] = useState(0);
  const [qtyTransfer, setQtyTransfer] = useState(0);
  const [remarkTransfer, setRemarkTransfer] = useState("");
  const [transferCreatedAt, setTransferCreatedAt] = useState(new Date());
  const [productionTransfer, setProductionTransfer] = useState(0);

  const [totalProductionLog, setTotalProductionLog] = useState(0);
  const [totalProductionLoss, setTotalProductionLoss] = useState(0);
  const [totalProductionFree, setTotalProductionFree] = useState(0);
  const [remarkImport, setRemarkImport] = useState("");
  const [qtyImport, setQtyImport] = useState(0);

  const [showModalHistoryTransfer, setShowModalHistoryTransfer] =
    useState(false);
  const [transferStock, setTransferStock] = useState<TransferInterface[]>([]);

  const fetchStoreImport = async (inputStockId: number) => {
    try {
      const response = await getImportHistory(inputStockId);
      if (response.status === 200) {
        setStoreImport(response.data);
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const fetchStock = async () => {
    try {
      const response = await getStocks();
      if (response.status === 200) {
        setStocks(response.data);
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        remark,
        address,
      };
      const response =
        stockId > 0
          ? await updateStock(stockId, payload)
          : await createStock(payload);

      if (response.status === 200) {
        setStockId(0);
        setName("");
        setAddress("");
        setRemark("");
        successSwal("Create Stock Successfully");
        await fetchStock();
        setShowModal(false);
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const handleEdit = (stock: StockInterface) => {
    setStockId(stock.id);
    setName(stock.name);
    setAddress(stock.address);
    setRemark(stock.remark);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await confirmSwal(
        "Are you sure to delete?",
        "Delete Stock Confirmation"
      );
      if (result.isConfirmed) {
        const response = await deleteStock(id);
        if (response.status === 200) {
          successSwal("Delete Successfully");
          await fetchStock();
        }
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const handleAdd = () => {
    setStockId(0);
    setName("");
    setAddress("");
    setRemark("");
    setShowModal(true);
  };

  const fetchProduction = async () => {
    try {
      const response = await getProductions();
      if (response.status === 200) {
        setProduction(response.data);
        await changeProduction(response.data[0].id);
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const changeProduction = async (id: number) => {
    setProductionId(id);
    try {
      const response = await getDataImport(id);
      if (response.status === 200) {
        const data = response.data;
        setTotalProductionLog(data.totalProductionLog || 0);
        setTotalProductionLoss(data.totalProductionLoss || 0);
        setTotalProductionFree(
          data.totalProductionLog - data.totalProductionLoss
        );
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const handleImport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = {
        production: {
          id: productionId,
        },
        stock: {
          id: stockId,
        },
        qty: qtyImport,
        remark: remarkImport,
        importDate: new Date(),
      };
      const response = await importProductToStock(data);
      if (response.status === 200) {
        setShowModalImport(false);
        successSwal("Import Product Successfully", "", 1500);
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const handleDeleteImport = async (id: number) => {
    try {
      const result = await confirmSwal(
        "Are you sure to delete?",
        "Delete Import Confirmation"
      );
      if (result.isConfirmed) {
        const response = await deleteImportHistory(id);
        if (response.status === 200) {
          await fetchStoreImport(stockId);
        }
      }
      setShowModalHistory(true);
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const fetchTransferHistory = async () => {
    const response = await getTransferStock();
    if (response.status === 200) {
      setTransferStock(response.data);
    }
  };

  const openModalTransfer = (stockId: number, stockName: string) => {
    setShowModalTransfer(true);
    setFromStoreId(stockId);
    setFromStockName(stockName);
    const defaultToStock = stocks.find((stock) => stock.id !== stockId);
    if (defaultToStock) {
      setToStoreId(defaultToStock.id);
    }
    setProductionTransfer(production[0].id);
  };

  const closeModalTransfer = () => {
    setShowModalTransfer(false);
    setFromStoreId(0);
    setToStoreId(0);
    setQtyTransfer(0);
    setRemarkTransfer("");
    setTransferCreatedAt(new Date());
    setProductionTransfer(production[0].id);
  };

  const handleTransferStock = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = {
        fromStockId: fromStoreId,
        toStockId: toStoreId,
        productionId: productionTransfer,
        quantity: qtyTransfer,
        remark: remarkTransfer,
        createdAt: transferCreatedAt,
      };
      const response = await createTransferStock(data);
      if (response.status === 200) {
        successSwal("Transfer Successfully");
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const openModalTransferHistory = async () => {
    setShowModalHistoryTransfer(true);
    try {
      await fetchTransferHistory();
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const handleDeleteTransfer = async (id: number) => {
    try {
      const result = await confirmSwal(
        "Are you sure to delete?",
        "Delete Confirmation"
      );
      if (result.isConfirmed) {
        const response = await deleteTransferStock(id);
        if (response.status === 200) {
          successSwal("Delete Successfully", "", 1000);
          await fetchTransferHistory();
        }
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
    setShowModalHistoryTransfer(true);
  };

  const closeModalTransferHistory = () => {
    setShowModalHistoryTransfer(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStock();
    fetchProduction();
  }, []);

  return (
    <div className="container">
      <h1 className="text-2xl font-bold">Product Stock</h1>
      <div className="flex flex-col gap-2 my-4">
        <div className="flex gap-2">
          <button className="btn-add" onClick={handleAdd}>
            <i className="fa-solid fa-plus mr-2"></i>
            Add Stock
          </button>
          <button className="btn-add" onClick={openModalTransferHistory}>
            <i className="fa-solid fa-exchange mr-2"></i>Transfer History
          </button>
        </div>
      </div>
      <div className="table-container">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Remark</th>
              <th className="w-[120px]"></th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.id}>
                <td>{stock.name}</td>
                <td>{stock.address}</td>
                <td>{stock.remark}</td>
                <td>
                  <div className="flex gap-1 justify-center">
                    <button
                      className="table-edit-btn table-action-btn"
                      onClick={() => {
                        setStockId(stock.id);
                        setShowModalImport(true);
                      }}>
                      <i className="fa fa-plus mr-2"></i>Add Product
                    </button>
                    <button
                      className="table-edit-btn table-action-btn"
                      onClick={() => openModalTransfer(stock.id, stock.name)}>
                      <i className="fa fa-exchange-alt mr-2"></i>Transfer
                    </button>
                    <button
                      className="table-edit-btn table-action-btn"
                      onClick={async () => {
                        setShowModalHistory(true);
                        setStockId(stock.id);
                        await fetchStoreImport(stock.id);
                      }}>
                      <i className="fa fa-history mr-2"></i>
                      History
                    </button>
                    <button
                      className="table-edit-btn table-action-btn"
                      onClick={() => handleEdit(stock)}>
                      <i className="fa fa-pencil"></i>
                    </button>
                    <button
                      className="table-delete-btn table-action-btn"
                      onClick={() => handleDelete(stock.id)}>
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <Modal
          title={stockId > 0 ? "Edit Stock" : "Create Stock"}
          onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="flex flex-col gap-3">
            <FormInput
              title="Name"
              value={name}
              setValue={setName as () => void}
              placeholder=""
              icon=""
            />
            <FormInput
              title="Address"
              value={address}
              setValue={setAddress as () => void}
              placeholder=""
              icon=""
            />
            <FormInput
              title="Remark"
              value={remark}
              setValue={setRemark as () => void}
              placeholder=""
              icon=""
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="modal-btn modal-btn-cancel">
                <i className="fa fa-times mr-2"></i>
                Cancel
              </button>
              <button type="submit" className="modal-btn modal-btn-submit">
                <i className="fa fa-save mr-2"></i>
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
      {showModalImport && (
        <Modal
          title="Add Product To Stock"
          onClose={() => setShowModalImport(false)}>
          <form onSubmit={handleImport} className="flex flex-col gap-2">
            <div>
              <label className="mb-2">Adding Product</label>
              <select
                className="input-field"
                value={productionId}
                onChange={(e) => changeProduction(Number(e.target.value))}>
                {production.map((product) => (
                  <option value={product.id} key={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2">Production Quantity</label>
              <input
                type="number"
                value={totalProductionLog}
                className="input-field"
                readOnly
                disabled
              />
            </div>
            <div>
              <label className="mb-2">Loss Quantity</label>
              <input
                type="number"
                value={totalProductionLoss}
                className="input-field"
                readOnly
                disabled
              />
            </div>
            <div>
              <label className="mb-2">Remaining Quantity</label>
              <input
                type="number"
                value={totalProductionFree}
                className="input-field"
                readOnly
                disabled
              />
            </div>

            <FormInput
              title="Stocking Quantity"
              isNumber
              value={qtyImport}
              setValue={setQtyImport as () => void}
              placeholder=""
              icon=""
            />
            <FormInput
              title="Import Remark"
              value={remarkImport}
              setValue={setRemarkImport as () => void}
              placeholder=""
              icon=""
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModalImport(false)}
                type="button"
                className="modal-btn modal-btn-cancel">
                <i className="fas fa-times mr-2"></i>Cancel
              </button>
              <button type="submit" className="modal-btn modal-btn-submit">
                <i className="fas fa-check mr-2"></i>Save
              </button>
            </div>
          </form>
        </Modal>
      )}
      {showModalHistory && (
        <Modal
          title="Import Stock History"
          onClose={() => setShowModalHistory(false)}
          size="2xl">
          <div className="table-container">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Remark</th>
                  <th>Date</th>
                  <th className="w-[60px]"></th>
                </tr>
              </thead>
              <tbody>
                {storeImport.map((storeImport) => (
                  <tr key={storeImport.id}>
                    <td>{storeImport.production.name}</td>
                    <td>{storeImport.qty}</td>
                    <td>{storeImport.remark}</td>
                    <td>
                      {new Date(storeImport.importDate).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteImport(storeImport.id)}
                        className="table-delete-btn table-action-btn">
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
      {showModalTransfer && (
        <Modal size="lg" title="Transfer Stock" onClose={closeModalTransfer}>
          <form onSubmit={handleTransferStock} className="flex flex-col gap-2">
            <div>
              <label>Starting Stock</label>
              <input type="text" value={fromStockName} disabled />
            </div>
            <div>
              <label>Stoping Stock</label>
              <select onChange={(e) => setToStoreId(Number(e.target.value))}>
                {stocks.map(
                  (stock) =>
                    stock.id !== fromStoreId && (
                      <option key={stock.id} value={stock.id}>
                        {stock.name}
                      </option>
                    )
                )}
              </select>
            </div>
            <div>
              <label>Transferred Production</label>
              <select
                onChange={(e) => setProductionTransfer(Number(e.target.value))}>
                {production.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Quantity</label>
              <input
                type="number"
                onChange={(e) => setQtyTransfer(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Remark</label>
              <input onChange={(e) => setRemarkTransfer(e.target.value)} />
            </div>
            <div>
              <label>Transfer Date</label>
              <input
                type="date"
                value={transferCreatedAt.toISOString().split("T")[0]}
                onChange={(e) => setTransferCreatedAt(new Date(e.target.value))}
              />
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                className="modal-btn modal-btn-cancel"
                onClick={closeModalTransfer}>
                <i className="fas fa-times mr-2"></i>Cancel
              </button>
              <button type="submit" className="modal-btn modal-btn-submit">
                <i className="fas fa-check mr-2"></i>Save
              </button>
            </div>
          </form>
        </Modal>
      )}
      {showModalHistoryTransfer && (
        <Modal
          size="3xl"
          title="Transfer History"
          onClose={closeModalTransferHistory}>
          <div className="table-container">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Start</th>
                  <th>Stop</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Remark</th>
                  <th>Date</th>
                  <th className="w-[60px]"></th>
                </tr>
              </thead>
              <tbody>
                {transferStock.map((tstock) => (
                  <tr key={tstock.id}>
                    <td>{tstock.fromStock.name}</td>
                    <td>{tstock.toStock.name}</td>
                    <td>{tstock.production.name}</td>
                    <td>{tstock.quantity}</td>
                    <td>{tstock.remark}</td>
                    <td>
                      {new Date(tstock.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteTransfer(tstock.id)}
                        className="table-delete-btn table-action-btn">
                        <i className="fa fa-trash"></i>
                      </button>
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
