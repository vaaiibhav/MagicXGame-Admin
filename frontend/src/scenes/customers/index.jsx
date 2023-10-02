import React, { useState, useLazyQuery } from "react";
import { useSelector } from "react-redux";
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
import { useGetCustomersQuery, useGetAvailUserQuery } from "../../state/api";
import Header from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";
import jwtDecode from "jwt-decode";
const Customers = () => {
  const theme = useTheme();
  // Handling Pin Button
  const [pinOpen, setPinOpen] = useState(false);
  const token = useSelector((state) => state.global.token);
  const decodedToken = jwtDecode(token) || {};
  const handlePinOpen = () => {
    setPinOpen(true);
  };
  const handleUserCreate = () => {};
  const handlePinClose = () => {
    setPinOpen(false);
  };
  // displaying Existing Customers
  const { data: usersData, isLoading: usersLoading } = useGetCustomersQuery({
    userType: decodedToken?.userType,
    userID: decodedToken?.userID,
  });
  //  create new Customer
  // const [addCustomer] =
  // Handling New Customer Button
  const [addUserOpen, setUserOpen] = useState(false);

  const [availUsers] = useGetAvailUserQuery();

  const handleUserOpen = () => {
    setUserOpen(true);
    availUsers({
      userType: decodedToken?.userType,
      userID: decodedToken?.userID,
    });
  };

  const handleUserClose = () => {
    setUserOpen(false);
  };
  const renderDetailsButton = (params) => {
    return (
      <strong>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => {
            handlePinOpen();
            // pinDialog(params);
          }}
        >
          Reset P&P
        </Button>
      </strong>
    );
  };
  const pinDialog = (params) => {};
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
      field: "userType",
      headerName: "Role",
      flex: 0.5,
    },
    {
      field: "setPin",
      headerName: "SetPin",
      renderCell: renderDetailsButton,
      flex: 0.5,
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
      flex: 0.4,
    },
    {
      field: "userSubAdminID",
      headerName: "SubAdmin ID",
      flex: 0.4,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="CUSTOMERS" subtitle="List of Customers" />

      <Dialog open={pinOpen} onClose={handlePinClose}>
        <DialogTitle>Customer Pin and Password</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="password"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="pin"
            name="pin"
            label="PIN"
            type="password"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            size="medium"
            onClick={handlePinClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            onClick={handlePinClose}
          >
            Set
          </Button>
        </DialogActions>
      </Dialog>
      <div className="m-3 ">
        <Button
          variant="contained"
          color="secondary"
          onClick={handleUserOpen}
          size="large"
        >
          Add Customer
        </Button>
      </div>
      <Dialog open={addUserOpen} onClose={handleUserClose}>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="userName"
            name="userName"
            label="Name"
            type="text"
            fullWidth
            variant="filled"
          />
          <TextField
            autoFocus
            margin="dense"
            id="userCity"
            name="userCity"
            label="City"
            type="text"
            fullWidth
            variant="filled"
          />
          <TextField
            autoFocus
            margin="dense"
            id="userPhoneNumber"
            name="userPhoneNumber"
            label="Phone Number"
            type="text"
            fullWidth
            variant="filled"
          />
          <TextField
            autoFocus
            margin="dense"
            id="userPercentage"
            name="userPercentage"
            label="Percentage"
            type="text"
            fullWidth
            variant="filled"
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            size="medium"
            onClick={handleUserClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            disabled={!usersData}
            onClick={handleUserCreate}
          >
            Set
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
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
    </Box>
  );
};

export default Customers;
