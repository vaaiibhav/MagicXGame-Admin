import React, { useEffect, useState } from "react";
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
const ResetPinPass = (props) => {
  console.log("props:", props);
  const [pinDialog, setPinDialog] = useState(false);

  useEffect(() => {
    setPinDialog(props.pinOpen);
  }, [props.pinOpen]);
  const pinDialogSet = () => {
    console.log("Pin Set:", props);
  };
  const handlePinClose = () => {
    setPinDialog(false);
  };
  return (
    <>
      {/* Customer Pin and Password Dialog Start */}
      <Dialog open={pinDialog} onClose={handlePinClose}>
        <DialogTitle>Customer Pin and Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props?.userPinReset?.data && (
              <>
                <div>
                  User ID ={props?.userPinReset?.data?.userLoginID}
                  <br></br>
                  New Password= {props?.userPinReset?.data?.password}
                  <br></br>
                  New Pin = {props?.userPinReset?.data?.pin}
                  <br></br>
                </div>
              </>
            )}
          </DialogContentText>
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
            onClick={pinDialogSet}
          >
            Set
          </Button>
        </DialogActions>
      </Dialog>
      {/* Customer Pin and Password Dialog Ends */}
    </>
  );
};

export default ResetPinPass;
