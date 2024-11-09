import React from "react";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import { useGetJhandiMundabetsQuery } from "../../state/api";
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
const JhandiMunda = () => {
  const theme = useTheme();
  const { data: jhandimundaData, isLoading: jhandimundaDataLoading } =
    useGetJhandiMundabetsQuery();
  const columns = [
    {
      field: "gudGudiBetID",
      headerName: "ID",
      flex: 0.3,
    },
    {
      field: "slot0Bet",
      headerName: "♠️",
      flex: 0.3,
    },
    {
      field: "slot1Bet",
      headerName: "👑",
      flex: 0.3,
    },
    {
      field: "slot2Bet",
      headerName: "❤️",
      flex: 0.3,
    },
    {
      field: "slot3Bet",
      headerName: "♦️",
      flex: 0.3,
    },
    {
      field: "slot4Bet",
      headerName: "🚩",
      flex: 0.3,
    },
    {
      field: "slot5Bet",
      headerName: "♣️",
      flex: 0.3,
    },
    {
      field: "totalBet",
      headerName: "Total Bet",
      flex: 0.3,
    },
    {
      field: "gameID",
      headerName: "Game ID",
      flex: 0.3,
    },
    {
      field: "userLoginID",
      headerName: "User ID",
      flex: 0.3,
    },

    {
      field: "createdAt",
      headerName: "Date & Time ",
      flex: 0.6,
      valueFormatter: (params) =>
        new Date(params?.value).toLocaleString("en-GB", {
          hour12: true,
        }),
    },
  ];

  return (
    <div>
      <Box m="1.5rem 1rem">
        <Header title="Bets 🎲" subtitle="Jhandi Munda Bets" />
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
            loading={jhandimundaDataLoading || !jhandimundaData}
            getRowId={(row) => row?.gudGudiBetID}
            rows={jhandimundaData || []}
            columns={columns}
          />
        </Box>
        {/* Display Users End*/}
      </Box>
    </div>
  );
};

export default JhandiMunda;
