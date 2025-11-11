"use client";

import { getAllUsers, createUser, editUser, deleteUser } from "@/app/apis/user";
import { confirmSwal, errorSwal, successSwal } from "@/app/utils/swalNotify";
import { FormEvent, useEffect, useState } from "react";
import Modal from "../components/Modal";
import FormInput from "@/app/components/form-input";
import { UserInterface } from "@/app/interface/UserInterface";

export default function Page() {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserInterface | null>(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("employee");

  const fetchUsers = async () => {
    try {
      const respone = await getAllUsers();

      if (respone.status === 200) {
        setUsers(respone.data);
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        errorSwal("Password and Confirmed password are not matched");
      }
      const payload = { username, email, password, role };
      const response = editingUser
        ? await editUser(editingUser.id, payload)
        : await createUser(payload);

      if (response.status === 200) {
        successSwal(
          editingUser
            ? "Edit profile successfully"
            : "Create user successfully",
          "",
          1000
        );
        setShowModal(false);
        setEditingUser(null);
        setUsername("");
        setPassword("");
        setEmail("");
        setConfirmPassword("");

        fetchUsers();
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const handleDelete = async (user: UserInterface) => {
    try {
      const result = await confirmSwal(
        "Are you sure to delete user : " + user.username + " ?",
        "Delete User Confirmation",
        "warning"
      );
      if (result.isConfirmed) {
        const response = await deleteUser(user.id);
        if (response.status === 200) {
          successSwal("Delete successfully", "", 1000);
          fetchUsers();
        }
      }
    } catch (err) {
      errorSwal((err as { message: string }).message);
    }
  };

  const handleEdit = (user: UserInterface) => {
    setEditingUser(user);
    setUsername(user.username);
    setEmail(user.email);
    setPassword("");
    setConfirmPassword("");
    setShowModal(true);
    setRole(user.role ?? "employee");
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-5">User Management</h1>
      <div className="flex justify-between items-center mb-6">
        <button
          className="btn-add"
          onClick={() => {
            setEditingUser(null);
            setEmail("");
            setUsername("");
            setPassword("");
            setConfirmPassword("");
            setShowModal(true);
          }}>
          <i className="fas fa-plus mr-2"></i>Add User
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Email</th>
              <th className="">Username</th>
              <th>Role</th>
              <th className="text-right" style={{ width: "100px" }}>
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td className="text-right">
                  <button
                    className="table-action-btn table-edit-btn mr-2"
                    onClick={() => handleEdit(user)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="table-action-btn table-delete-btn"
                    onClick={() => handleDelete(user)}>
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
          id="user-modal"
          title={editingUser ? "Edit User" : "Add New User"}
          onClose={() => setShowModal(false)}
          size="md">
          <form onSubmit={handleSubmit} className="space-y-2">
            <FormInput
              title="Email"
              value={email}
              setValue={setEmail as () => void}
              placeholder=""
              icon=""
              required
            />
            <FormInput
              title="Username"
              value={username}
              setValue={setUsername as () => void}
              placeholder=""
              icon=""
              required
            />
            <FormInput
              title="Password"
              value={password}
              setValue={setPassword as () => void}
              placeholder={
                editingUser ? "Leave blank to keep current password" : ""
              }
              icon=""
              required={!editingUser}
            />
            <FormInput
              title="Confirmed Password"
              value={confirmPassword}
              setValue={setConfirmPassword as () => void}
              placeholder=""
              icon=""
              required={!editingUser}
            />
            <div className="mb-4">
              <label className="block mb-2">Role</label>
              <select
                className="form-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="modal-btn modal-btn-cancel">
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
