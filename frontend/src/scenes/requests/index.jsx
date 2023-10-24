import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import Header from "../../components/Header";
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
import { DataGrid } from "@mui/x-data-grid";
import jwtDecode from "jwt-decode";
import CreateRequest from "./CreateRequest";
import { useGetRequestsQuery } from "../../state/api";
const Requests = () => {
  const theme = useTheme();
  const token = useSelector((state) => state?.global?.token);
  const decodedToken = jwtDecode(token) || {};
  const { data: requestData, isLoading: requestLoading } =
    useGetRequestsQuery();
  const columns = [
    {
      field: "requestID",
      headerName: "ID",
      flex: 0.3,
    },
    {
      field: "requestText",
      headerName: "Request",
      flex: 0.7,
    },
    {
      field: "requestType",
      headerName: "Type",
      flex: 0.4,
    },
    {
      field: "requestByUser",
      headerName: "userLoginID",
      flex: 0.4,
    },
    {
      field: "requestStatus",
      headerName: "Status",
      flex: 0.4,
    },
    {
      field: "createdAt",
      headerName: "Date ",
      flex: 0.6,
      valueFormatter: (params) => new Date(params?.value).toLocaleString(),
    },
  ];
  return (
    <div>
      <Box m="1.5rem 2.5rem">
        <Header title="Requests" subtitle="Admin Requests" />
        {decodedToken?.userType !== "admin" && <CreateRequest />}
        {/* Display Notification Starts */}
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
            loading={requestLoading || !requestData}
            getRowId={(row) => row?.requestID}
            rows={requestData || []}
            columns={columns}
          />
        </Box>
        {/* Display Users End*/}
      </Box>
    </div>
  );
};

export default Requests;
