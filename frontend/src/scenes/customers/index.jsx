import React, { useState } from "react";
import { useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { Toaster, toast } from "sonner";
import {
  Box,
  Button,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import copy from "copy-to-clipboard";
import { useEditPinMutation, useGetCustomersQuery } from "../../state/api";
import Header from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";
import CreateUser from "./CreateUser";
import ResetPinPass from "./ResetPinPass";
import EditUser from "./EditUser";

const Customers = () => {
  const token = useSelector((state) => state?.global?.token);
  const decodedToken = jwtDecode(token) || {};
  const theme = useTheme();

  // displaying Existing Customers
  const { data: usersData, isLoading: usersLoading } = useGetCustomersQuery();

  const [editPin] = useEditPinMutation();
  // Handling Pin Button
  const [pinOpen, setPinOpen] = useState(false);
  const [userPinReset, setPinReset] = useState({});
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const handleEditUser = (editUserData) => {
    setUserDetails(editUserData);
    setEditUserOpen(editUserOpen ? false : true);
  };
  const handlePinOpen = () => {
    setPinOpen(pinOpen ? false : true);
  };
  const pinReset = async (params) => {
    return await editPin({ userLoginID: params?.userLoginID });
  };
  const handleUserBlock = async (blockUserRow) => {
    console.log("blockUserRow:", blockUserRow);
  };
  const userBlock = (blockUserRow) => {
    return (
      <strong>
        <Button
          variant="contained"
          color={blockUserRow?.row?.userAllowed ? "warning" : "success"}
          size="small"
          onClick={() => {
            handleUserBlock(blockUserRow?.row);
          }}
        >
          {blockUserRow?.row?.userAllowed ? "Block" : "Allow"}
        </Button>
      </strong>
    );
  };
  const resetPinButton = (params) => {
    return (
      <strong>
        <Button
          variant="contained"
          color="warning"
          size="small"
          onClick={async () => {
            await setPinReset(await pinReset(params?.row));
            handlePinOpen();
          }}
        >
          Reset P&P
        </Button>
      </strong>
    );
  };
  const editUserButton = (params) => {
    return (
      <strong>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => {
            handleEditUser(params?.row);
            // pinDialog(params);
          }}
        >
          Edit{" "}
        </Button>
      </strong>
    );
  };

  let columns = [
    {
      field: "userLoginID",
      headerName: "Login ID",
      flex: 0.5,
    },
    {
      field: "userName",
      headerName: "Name",
      flex: 0.7,
    },
    {
      field: "userBalance",
      headerName: "Balance",
      flex: 0.6,
    },
    {
      field: "userAvailableBalance",
      headerName: "Avail Balance",
      flex: 0.5,
    },
    {
      field: "userType",
      headerName: "Role",
      renderCell: (params) => {
        return params?.row?.userType == "subadmin"
          ? "Sub Admin"
          : params?.row?.userType == "master"
          ? "Master"
          : "Retailer";
      },
      flex: 0.5,
    },
    {
      field: "userEdit",
      headerName: "User",
      renderCell: editUserButton,
      flex: 0.4,
    },
    {
      field: "setPin",
      headerName: "Reset Pin&Pass",
      renderCell: resetPinButton,
      flex: 0.4,
    },
    {
      field: "userPhoneNumber",
      headerName: "Phone Number",
      flex: 0.6,
      renderCell: (params) => {
        return params?.value?.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
      },
    },
    {
      field: "userCity",
      headerName: "City",
      flex: 0.3,
    },
    {
      field: "userAllowed",
      headerName: "User Allowed",
      renderCell: userBlock,
      flex: 0.4,
    },
    // {
    //   field: "userSubAdminID",
    //   headerName: "SubAdmin ID",
    //   flex: 0.2,
    // },
    // {
    //   field: "createdAt",
    //   headerName: "Created On",
    //   flex: 0.7,
    //   valueFormatter: (params) =>
    //     new Date(params?.value).toLocaleString("en-GB"),
    // },
  ];
  if (decodedToken?.userType == "admin") {
    columns.push({
      field: "usersAllowedUnder",
      headerName: "User Limit",
      flex: 0.4,
    });
  }
  return (
    <Box m="1.5rem 1rem">
      <Header title="CUSTOMERS" subtitle="List of Customers" />

      <CreateUser />
      <ResetPinPass userPinReset={userPinReset} pinOpen={pinOpen} />
      <EditUser editUserOpen={editUserOpen} userDetails={userDetails} />
      {/* Display Users Start */}
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            overflow: "auto",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            overflow: "auto",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
            overflow: "auto",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
            overflow: "auto",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
            overflow: "auto",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            overflow: "auto",
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={usersLoading || !usersData}
          getRowId={(row) => row?.userID}
          rows={usersData || []}
          columns={columns}
        />
      </Box>
      {/* Display Users End*/}
    </Box>
  );
};

export default Customers;
