"use client";

import { config } from "./config";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import FormInput from "./components/form-input";
import { errorSwal } from "./utils/swalNotify";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignin = async () => {
    try {
      const url = `${config.apiUrl}/api/users/admin-signin`;
      const payload = { username, password };
      const response = await axios.post(url, payload);
      if (response.status === 200) {
        document.cookie = config.tokenKey + "=" + response.data.token;
        localStorage.setItem(config.tokenKey, response.data.token);
        if (response.data.role !== "admin") {
          router.push("/erp/sale");
        } else {
          router.push("/erp/dashboard");
        }
      }
    } catch (err) {
      errorSwal("Invalid username or password");
    }
  };
  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">
          <i className="fas fa-leaf"></i> Spring-ERP 2025
        </h1>
        <h2 className="login-subtitle">Enterprise Resource Planning System</h2>
        <form className="login-form">
          <FormInput
            title="Username"
            value={username}
            setValue={setUsername as () => void}
            placeholder="Enter Your Username"
            icon="fa-user"
          />
          <FormInput
            title="Password"
            value={password}
            setValue={setPassword as () => void}
            placeholder="Enter Your Password"
            icon="fa-lock"
          />
          <button type="button" className="login-button" onClick={handleSignin}>
            <i className="fas fa-sign-in-alt mr-2"></i>Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
