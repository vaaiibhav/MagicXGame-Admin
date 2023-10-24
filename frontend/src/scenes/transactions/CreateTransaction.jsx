import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, useTheme, Button, Input, Checkbox } from "@mui/material";
import Header from "../../components/Header";
import { Toaster, toast } from "sonner";
import jwtDecode from "jwt-decode";
import preventMinus from "../../functions/preventMinus";
import { useAddTransactionMutation, useGetBalanceQuery } from "../../state/api";
const CreateTransaction = () => {
  const [addTransaction] = useAddTransactionMutation();
  const token = useSelector((state) => state?.global?.token);
  const decodedToken = jwtDecode(token) || {};
  const [userToken, setUserToken] = useState(decodedToken);
  const [sendBalance, setSendBalance] = useState({
    toUserLoginID: "",
    transferAmount: "",
    userPin: "",
  });
  const handleInputs = (e) => {
    const eValue = e.target.value;
    if (
      e.target.name == "transferAmount" &&
      parseInt(eValue) > parseInt(balanceData?.userAvailableBalance)
    )
      return toast.error("Insufficient Balance");
    setSendBalance({
      ...sendBalance,
      [e.target.name]: eValue,
    });
  };
  const { data: balanceData, isLoading: balanceLoading } = useGetBalanceQuery();
  useEffect(() => {});
  const submitTransaction = async () => {
    const result = await addTransaction(sendBalance);
    const pinFail = JSON.parse(result?.data);
    if (pinFail?.error) {
      return toast.error(pinFail?.error);
    }
    toast.success("Balance Transferred Successfully");
    setSendBalance({
      toUserLoginID: "",
      transferAmount: "",
      userPin: "",
    });
  };
  return (
    <div>
      <Box m="0.5rem 0rem" className="bg-green-600 ">
        <Header title="Balance" subtitle="" />
        <div className="flex">
          <div className="flex-1 bg-yellow-600">
            Total Balance: {balanceData?.userBalance}
          </div>
          <span className="flex-1 bg-red-700">
            Available Balance: {balanceData?.userAvailableBalance}
          </span>
          <span className="flex-1">Upper Level</span>
        </div>
        <div className="flex">
          <div className="flex-1">My Profit/Loss</div>
          <span className="flex-1">Down Level Profit/Loss</span>
          <span className="flex-1">Down Level</span>
        </div>
      </Box>
      <Box m="2rem 1rem">
        <Header title="SEND" subtitle="Send Balance to Customer" />
        <Toaster />
        <div className="flex-col space-x-3 space-y-3 ">
          <Input
            placeholder="to User ID"
            name="toUserLoginID"
            max={8}
            onKeyDown={preventMinus}
            type="number"
            onChange={handleInputs}
            value={sendBalance?.toUserLoginID}
          ></Input>
          <Input
            placeholder="Amount"
            name="transferAmount"
            max={6}
            type="number"
            onKeyDown={preventMinus}
            onChange={handleInputs}
            value={sendBalance?.transferAmount}
          ></Input>
          <Input
            placeholder="Pin"
            name="userPin"
            type="number"
            onKeyDown={preventMinus}
            onChange={handleInputs}
            max={4}
            value={sendBalance?.userPin}
          ></Input>
          <Button
            variant="contained"
            color="secondary"
            onClick={submitTransaction}
            size="large"
          >
            New Transfer
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default CreateTransaction;
