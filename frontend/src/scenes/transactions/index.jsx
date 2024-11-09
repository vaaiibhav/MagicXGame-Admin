import React, { useState } from "react";
import { Box, useTheme, Button, Input, Checkbox } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetTransactionsQuery } from "../../state/api";
import jwtDecode from "jwt-decode";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import DataGridCustomToolbar from "../../components/DataGridCustomToolbar";
import CreateTransaction from "./CreateTransaction";
import SentTransactions from "./SentTransactions";
import ReceiveTransactions from "./ReceiveTransactions";

const Transactions = () => {
  const { data: transactionsData, isLoading: transactionsLoading } =
    useGetTransactionsQuery();

  const columns = [
    {
      field: "transactionID",
      headerName: "Transaction ID",
      flex: 0.5,
    },

    {
      field: "transactionFrom",
      headerName: "From User",
      flex: 0.8,
    },
    {
      field: "transactionTo",
      headerName: "To User",
      flex: 0.8,
    },
    {
      field: "transactionAmount",
      headerName: "Amount",
      flex: 0.6,
    },
    {
      field: "transactionStatus",
      headerName: "Status",
      flex: 0.6,
    },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 1.2,
      valueFormatter: (params) =>
        new Date(params?.value).toLocaleString("en-GB"),
    },

    // {
    //   field: "products",
    //   headerName: "To UserID",
    //   flex: 1,
    //   renderCell: (params) => params.value.length,
    // }
  ];

  return (
    <Box m="1.5rem 1rem">
      <CreateTransaction />
      <div className="flex flex-col ">
        <SentTransactions
          columns={columns}
          sentTransactions={transactionsData?.sentTransactions}
          transactionsLoading={false}
        />
        <ReceiveTransactions
          columns={columns}
          receivedTransactions={transactionsData?.receivedTransactions}
          transactionsLoading={false}
        />
      </div>
    </Box>
  );
};

export default Transactions;
