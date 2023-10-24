import React, { useState } from "react";
import { Box, useTheme, Button, Input, Checkbox } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetTransactionsQuery } from "../../state/api";
import Header from "../../components/Header";
import DataGridCustomToolbar from "../../components/DataGridCustomToolbar";
const ReceiveTransactions = (props) => {
  const isLoading = props?.transactionsLoading;
  const data = props?.receivedTransactions;
  const columns = props?.columns;
  const theme = useTheme();

  return (
    <>
      <Box m="2rem 1rem">
        <Header title="RECEIVE" subtitle="Entire list of Recieveables" />
        <Box
          height="80vh"
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
            loading={isLoading || !data}
            getRowId={(row) => row?.transactionID}
            rows={(data && data) || []}
            columns={columns}
            rowCount={(data && data?.total) || 0}
          />
        </Box>
      </Box>
    </>
  );
};

export default ReceiveTransactions;
