"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { config } from "../config";
import Link from "next/link";
import { confirmSwal, errorSwal } from "../utils/swalNotify";
import NavLink from "../components/nav-link";
import { getUserData } from "../apis/user";

export default function SideBar() {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState("");
  const [role, setRole] = useState("");

  const handleChangePath = (path: string) => {
    setCurrentPath(path);
    localStorage.setItem("currentPath", path);
  };

  const setDefaultSideBar = () => {
    const sidebar = localStorage.getItem("sidebar");
    const sideBarElement = document.querySelector(".sidebar") as HTMLElement;

    if (sidebar == "true") {
      sideBarElement.classList.add("hidden");
    } else {
      sideBarElement.classList.remove("hidden");
    }
  };

  const fetchData = async () => {
    try {
      const response = await getUserData();
      if (!response) {
        router.push("/");
        return;
      }

      if (response.status === 200) {
        setUsername(response.data.username);
        setRole(response.data.role);
      }
    } catch (err) {
      errorSwal("Can not fetch user data : " + err);
    }
  };

  const handleLogout = async () => {
    try {
      const button = await confirmSwal(
        "Are you sure to sign out?",
        "Sign Out Confirmation"
      );
      if (button.isConfirmed) {
        //remove cookie
        document.cookie = `${config.tokenKey}=; path=/; max-age=0`;
        localStorage.removeItem(config.tokenKey);
        localStorage.removeItem("currentPath");
        router.push("/"); // return to main page
      }
    } catch (err) {
      errorSwal("Can not sign out : " + err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    const getPathname = pathname.split("/")[pathname.split("/").length - 1];
    const savePathname = localStorage.getItem("currentPath") || "";
    if (savePathname) {
      router.push("/erp/" + savePathname);
      setCurrentPath(savePathname);
    } else {
      setCurrentPath(getPathname);
    }
    setDefaultSideBar();
  }, []);

  const toggleSideBar = () => {
    const sidebar = document.querySelector(".sidebar") as HTMLElement;
    if (sidebar) {
      if (sidebar.classList.contains("hidden")) {
        sidebar.classList.remove("hidden");
        localStorage.setItem("sidebar", "false");
      } else {
        sidebar.classList.add("hidden");
        localStorage.setItem("sidebar", "true");
      }
    }
  };

  return (
    <div className="flex items-start">
      <div className="sidebar">
        <div className="sidebar-container">
          <div className="sidebar-title">
            <h1>
              <i className="fas fa-leaf mt-3"></i>
              Spring ERP
            </h1>
            <div className="text-lg font-normal mt-3 mb-4">
              <i className="fas fa-user mr-3"></i>
              {username} ({role})
            </div>
            <div className="flex gap-1 m-3 justify-center">
              <Link
                href={"/erp/user/edit"}
                className="btn-edit"
                onClick={() => handleChangePath("user/edit")}>
                <i className="fas fa-edit mr-2"></i>
                Edit
              </Link>
              <button className="btn-logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>
          <nav>
            <ul className="sidebar-nav-list">
              {role === "admin" && (
                <NavLink
                  title="Dashboard"
                  icon="fa-home"
                  link="/erp/dashboard"
                  isPath={currentPath === "dashboard"}
                  onClick={() => handleChangePath("dashboard")}
                />
              )}
              <NavLink
                title="Stock"
                icon="fa-box"
                link="/erp/stock"
                isPath={currentPath === "stock"}
                onClick={() => handleChangePath("stock")}
              />
              <NavLink
                title="Production"
                icon="fa-cogs"
                link="/erp/production"
                isPath={currentPath === "production"}
                onClick={() => handleChangePath("production")}
              />
              <NavLink
                title="Sale"
                icon="fa-money-bill-trend-up"
                link="/erp/sale"
                isPath={currentPath === "sale"}
                onClick={() => handleChangePath("sale")}
              />
              {role === "admin" && (
                <>
                  <NavLink
                    title="Billing"
                    icon="fa-file-invoice-dollar"
                    link="/erp/bill-sale"
                    isPath={currentPath === "bill-sale"}
                    onClick={() => handleChangePath("bill-sale")}
                  />
                  <NavLink
                    title="Accounting"
                    icon="fa-file-invoice-dollar"
                    link="/erp/accounting"
                    isPath={currentPath === "accounting"}
                    onClick={() => handleChangePath("accounting")}
                  />
                  <NavLink
                    title="Report"
                    icon="fa-chart-line"
                    link="/erp/report"
                    isPath={currentPath === "report"}
                    onClick={() => handleChangePath("report")}
                  />
                  <NavLink
                    title="System Users"
                    icon="fa-user-alt"
                    link="/erp/user"
                    isPath={currentPath === "user"}
                    onClick={() => handleChangePath("user")}
                  />
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
      <button
        onClick={toggleSideBar}
        className="text-white ms-3 cursor-pointer">
        <i className="fas fa-bars"></i>
      </button>
    </div>
  );
}
