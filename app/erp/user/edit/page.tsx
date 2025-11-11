"use client";

import { editUserData, getUserData } from "@/app/apis/user";
import FormInput from "@/app/components/form-input";
import { errorSwal, successSwal } from "@/app/utils/swalNotify";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProfile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const response = await getUserData();
      if (response && response.status === 200) {
        setUsername(response.data.username);
        setEmail(response.data.email);
      }
    } catch (err) {
      errorSwal("Can not fetch user data");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        errorSwal("Password not match with confirmed password");
      } else {
        const response = await editUserData({ username, email, password });
        if (response.status === 200) {
          successSwal("Edit data successfully");
          router.push("/erp/dashboard");
        }
      }
    } catch (err) {
      errorSwal("Can not edit user data");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUserData();
  }, []);

  return (
    <div>
      <h1 className="login-title">Edit Profile</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <FormInput
          title={"Username"}
          value={username}
          setValue={setUsername as () => void}
          placeholder={""}
          icon={""}
        />
        <FormInput
          title={"Email"}
          value={email}
          setValue={setEmail as () => void}
          placeholder={""}
          icon={""}
        />
        <FormInput
          title={"Password"}
          value={password}
          setValue={setPassword as () => void}
          placeholder={""}
          icon={""}
          isPassword
        />
        <FormInput
          title={"Confirmed Password"}
          value={confirmPassword}
          setValue={setConfirmPassword as () => void}
          placeholder={""}
          icon={""}
          isPassword
        />
        <div className="form-group flex items-center">
          <button type="submit" className="button">
            <i className="fas fa-save mr-2"></i>Save
          </button>
        </div>
      </form>
    </div>
  );
}
