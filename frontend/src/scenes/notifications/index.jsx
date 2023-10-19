import React from "react";
import { useSelector } from "react-redux";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
} from "../../state/api";
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
import CreateNotification from "./CreateNotification";

const Notifications = () => {
  const theme = useTheme();
  const token = useSelector((state) => state?.global?.token);
  const decodedToken = jwtDecode(token) || {};
  const { data: notificationsData, isLoading: notificationsLoading } =
    useGetNotificationsQuery();
  const [deleteNotification] = useDeleteNotificationMutation();
  const deleteNotificationButton = (params) => {
    return (
      <strong>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => {
            console.log("params:", params.row.notificationID);
            deleteNotification(params.row.notificationID);
            // handleEditUser();
            // pinDialog(params);
          }}
        >
          Delete{" "}
        </Button>
      </strong>
    );
  };
  const columns = [
    {
      field: "notificationID",
      headerName: "ID",
      flex: 0.3,
    },
    {
      field: "notificationText",
      headerName: "Notification",
      flex: 0.7,
    },
    {
      field: "createdAt",
      headerName: "Date ",
      flex: 0.6,
      valueFormatter: (params) => new Date(params?.value).toLocaleString(),
    },
    {
      field: "notificationType",
      headerName: "Type",
      flex: 0.4,
    },
    {
      field: "notificationDelete",
      headerName: "Delete",
      renderCell: deleteNotificationButton,
      flex: 0.2,
    },
  ];
  return (
    <div>
      <Box m="1.5rem 2.5rem">
        <Header title="Notifications" subtitle="Admin Notifications" />
        {decodedToken?.userType == "admin" && <CreateNotification />}
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
            loading={notificationsLoading || !notificationsData}
            getRowId={(row) => row?.notificationID}
            rows={notificationsData || []}
            columns={columns}
          />
        </Box>
        {/* Display Users End*/}
      </Box>
    </div>
  );
};

export default Notifications;
