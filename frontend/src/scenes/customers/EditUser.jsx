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
  const propsUserDetails = props?.userDetails;
  const decodedToken = jwtDecode(token) || {};
  const [editCustomer] = useEditCustomerMutation();
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editUserData, setEditUserData] = useState({
    userName: propsUserDetails?.userName ? propsUserDetails?.userName : "",
    userCity: propsUserDetails?.userCity ? propsUserDetails?.userCity : "",
    userPhoneNumber: propsUserDetails?.userPhoneNumber
      ? propsUserDetails?.userPhoneNumber
      : "",
    userSubAdminPercentage: propsUserDetails?.userSubAdminPercentage
      ? propsUserDetails?.userSubAdminPercentage
      : "",
    userMasterPercentage: propsUserDetails?.userMasterPercentage
      ? propsUserDetails?.userMasterPercentage
      : "",
    userType: decodedToken.userType,
    userSubAdminId: decodedToken.userSubAdminId,
    userMasterId: decodedToken.userMasterId,
    userID: decodedToken.userID,
    userLoginID: decodedToken.userLoginID,
    usersAllowedUnder: propsUserDetails?.usersAllowedUnder
      ? propsUserDetails?.usersAllowedUnder
      : "10",
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
    editCustomer(editUserData);
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
              value={editUserData?.userName}
              onChange={handleUserEdit}
              fullWidth
              variant="filled"
            />
            <TextField
              autoFocus
              margin="dense"
              id="userCity"
              value={editUserData?.userCity}
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
              value={editUserData?.userPhoneNumber}
              id="userPhoneNumber"
              name="userPhoneNumber"
              label="Phone Number"
              type="phone"
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
                  value={editUserData?.userSubAdminPercentage}
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
                  value={editUserData?.userMasterPercentage}
                  name="userMasterPercentage"
                  label="Master Percentage"
                  type="number"
                  onKeyDown={preventMinus}
                  fullWidth
                  variant="filled"
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="user"
                  placeholder="10"
                  value={editUserData?.usersAllowedUnder}
                  onChange={handleUserEdit}
                  name="usersAllowedUnder"
                  label="Allowed Users"
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
