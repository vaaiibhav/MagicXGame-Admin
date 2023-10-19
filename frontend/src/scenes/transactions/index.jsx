import React, { useState } from "react";
import { Box, useTheme, Button, Input, Checkbox } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetTransactionsQuery } from "../../state/api";
import Header from "../../components/Header";
import DataGridCustomToolbar from "../../components/DataGridCustomToolbar";
import CreateTransaction from "./CreateTransaction";
import SentTransactions from "./SentTransactions";
import ReceiveTransactions from "./ReceiveTransactions";
const Transactions = () => {
  const theme = useTheme();

  const columns = [
    {
      field: "_id",
      headerName: "Transaction ID",
      flex: 0.5,
    },

    {
      field: "userId",
      headerName: "From UserID",
      flex: 1,
    },

    {
      field: "products",
      headerName: "To UserID",
      flex: 1,
      renderCell: (params) => params.value.length,
    },
    {
      field: "cost",
      headerName: "Amount",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
    {
      field: "coasdst",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      flex: 1,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <CreateTransaction />
      <div className="flex flex-col ">
        <SentTransactions columns={columns} />
        <ReceiveTransactions columns={columns} />
      </div>
    </Box>
  );
};

export default Transactions;
