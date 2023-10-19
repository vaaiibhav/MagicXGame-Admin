import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import jwtDecode from "jwt-decode";
import { useEditCustomerMutation } from "../../state/api";
import preventMinus from "../../functions/preventMinus";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
const EditUser = (props) => {
  const token = useSelector((state) => state?.global?.token);
  const decodedToken = jwtDecode(token) || {};
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editUserData, setEditUserData] = useState({
    userName: "",
    userCity: "",
    userPhoneNumber: "",
    userSubAdminPercentage: "",
    userMasterPercentage: "",
    userType: decodedToken.userType,
    userSubAdminId: decodedToken.userSubAdminId,
    userMasterId: decodedToken.userMasterId,
    userID: decodedToken.userID,
    userLoginID: decodedToken.userLoginID,
  });
  useEffect(() => {
    setEditUserOpen(props.editUserOpen);
  }, [props.editUserOpen]);

  const handleEditClose = () => {
    setEditUserOpen(false);
  };
  const handleUserEdit = (evt) => {
    const value = evt.target.value;
    setEditUserData({
      ...editUserData,
      [evt.target.name]: value,
    });
  };
  const submitEditUser = () => {
    console.log(editUserData);
  };

  return (
    <>
      {/* Customer Create Dialog Start */}
      <Toaster richColors />
      <Dialog open={editUserOpen} onClose={handleEditClose}>
        <form>
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogContent>
            {editUserData?.data && (
              <>
                <button
                  onClick={() => {
                    // copy(editUserData);
                    return toast("User Details Copied");
                  }}
                  className="text-sm border w-36 bg-red-500 mb-2 rounded p-2 transition"
                >
                  Copy to Send
                </button>
                <br />
                <p>
                  {" "}
                  New {editUserData?.data?.userType} Login is: &nbsp;
                  {editUserData?.data?.userLoginID}
                  <br />
                  Password: {editUserData?.data?.password}
                  <br />
                  Pin: {editUserData?.data?.pin}
                </p>
              </>
            )}
            <TextField
              autoFocus
              margin="dense"
              id="userName"
              name="userName"
              label="Name"
              type="text"
              onChange={handleUserEdit}
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
              onChange={handleUserEdit}
              fullWidth
              variant="filled"
            />
            <TextField
              autoFocus
              margin="dense"
              id="userPhoneNumber"
              name="userPhoneNumber"
              label="Phone Number"
              type="number"
              fullWidth
              onKeyDown={preventMinus}
              onChange={handleUserEdit}
              variant="filled"
            />
            {decodedToken.userType == "admin" && (
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  id="userSubAdminPercentage"
                  onChange={handleUserEdit}
                  name="userSubAdminPercentage"
                  label="Sub Admin Percentage"
                  type="number"
                  onKeyDown={preventMinus}
                  fullWidth
                  variant="filled"
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="userMasterPercentage"
                  onChange={handleUserEdit}
                  name="userMasterPercentage"
                  label="Master Percentage"
                  type="number"
                  onKeyDown={preventMinus}
                  fullWidth
                  variant="filled"
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="secondary"
              size="medium"
              onClick={handleEditClose}
            >
              {editUserData?.data?.userAllowed ? "close" : "cancel"}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="medium"
              onClick={submitEditUser}
              disabled={editUserData?.data?.userAllowed}
            >
              Set
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Customer Edit Dialog End */}
    </>
  );
};

export default EditUser;
