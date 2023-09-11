import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { BACKEND_URI } from "../constants";
import Layout from "./layout";
const Users = () => {
  const [getUsers, setUsers] = useState();

  useEffect(() => {
    async function getAllUsers() {
      const userData = await axios.get(`${BACKEND_URI}/users`, {
        withCredentials: true,
      });
      setUsers(userData.data.users);
    }
    getAllUsers();
  }, []);

  const DTColumns = [
    {
      name: "User ID",
      selector: (row) => row.userLoginID,
      sortable: true,
    },
    {
      name: "User Name",
      selector: (row) => row.userName,
    },
    {
      name: "User Balance",
      selector: (row) => row.userBalance,
      sortable: true,
    },
    {
      name: "User Type",
      selector: (row) => row.userType,
      sortable: true,
    },
    {
      name: "User City",
      selector: (row) => row.userCity,
    },
    {
      name: "Phone Number",
      selector: (row) => row.userPhoneNumber,
    },
    {
      name: "Master ID",
      selector: (row) => row.userMasterID,
      sortable: true,
    },
    {
      name: "SubAdmin ID",
      selector: (row) => row.userSubAdminID,
      sortable: true,
    },
  ];
  return (
    <div>
      <Layout />
      <div className="flex content-between p-4">
        <div className="flex-auto text-2xl font-bold text-gray-700 ">
          Users List
        </div>
        <button
          type="button"
          className="transition px-3 py-2 text-white duration-500 ease-in-out bg-blue-600 hover:bg-green-800 hover:text-slate-200 transform hover:-translate-y-1 hover:scale-105 "
        >
          Add New User
        </button>
      </div>
    </div>
  );
};

export default Users;
