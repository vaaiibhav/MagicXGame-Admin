import React, { useState } from "react";
import { Box, useTheme, Button, Input, Checkbox } from "@mui/material";

const CreateTransaction = () => {
  return (
    <div>
      <div className="flex-col space-x-3 space-y-3 ">
        <Input placeholder="to User ID"></Input>
        <Input placeholder="Amount"></Input>
        <Input placeholder="Pin"></Input>
        <Button
          variant="contained"
          color="secondary"
          onClick={console.log("New Transaction")}
          size="large"
        >
          New Transfer
        </Button>
      </div>
    </div>
  );
};

export default CreateTransaction;
