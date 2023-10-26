import React, { useState } from "react";
import { useSelector } from "react-redux";
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
import jwtDecode from "jwt-decode";
const Customers = () => {
  const theme = useTheme();
  const token = useSelector((state) => state?.global?.token);
  const decodedToken = jwtDecode(token) || {};

  // displaying Existing Customers
  const { data: usersData, isLoading: usersLoading } = useGetCustomersQuery();

  const [editPin] = useEditPinMutation();
  // Handling Pin Button
  const [pinOpen, setPinOpen] = useState(false);
  const [userPinReset, setPinReset] = useState({});
  const [editUserOpen, setEditUserOpen] = useState(false);
  const handleEditUser = () => {
    setEditUserOpen(editUserOpen ? false : true);
  };
  const handlePinOpen = () => {
    setPinOpen(pinOpen ? false : true);
  };
  const pinReset = async (params) => {
    return await editPin({ userLoginID: params.row.userLoginID });
  };

  const resetPinButton = (params) => {
    return (
      <strong>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={async () => {
            await setPinReset(await pinReset(params));
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
            handleEditUser();
            // pinDialog(params);
          }}
        >
          Edit{" "}
        </Button>
      </strong>
    );
  };

  const columns = [
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
      flex: 0.6,
    },
    {
      field: "userType",
      headerName: "Role",
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
      flex: 0.6,
    },
    {
      field: "userMasterID",
      headerName: "Master ID",
      flex: 0.2,
    },
    {
      field: "userSubAdminID",
      headerName: "SubAdmin ID",
      flex: 0.2,
    },
    {
      field: "createdAt",
      headerName: "Created On",
      flex: 0.7,
      valueFormatter: (params) => new Date(params?.value).toLocaleString(),
    },
  ];
  return (
    <Box m="1.5rem 1rem">
      <Header title="CUSTOMERS" subtitle="List of Customers" />

      <CreateUser />
      <ResetPinPass userPinReset={userPinReset} pinOpen={pinOpen} />
      <EditUser editUserOpen={editUserOpen} />
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
