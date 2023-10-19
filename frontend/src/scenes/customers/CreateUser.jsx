import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import jwtDecode from "jwt-decode";
import { useAddCustomerMutation } from "../../state/api";
import preventMinus from "../../functions/preventMinus";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
const CreateUser = () => {
  const token = useSelector((state) => state?.global?.token);
  const decodedToken = jwtDecode(token) || {};
  // Handling User Created Data
  const [newUserData, setNewUserData] = useState({});
  // handling User Create Form
  const [newUser, setNewUser] = useState({
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
  const handleUserCreate = (evt) => {
    const value = evt.target.value;
    setNewUser({
      ...newUser,
      [evt.target.name]: value,
    });
  };
  //  create new Customer
  const [addNewUser] = useAddCustomerMutation();
  const [copyUser, setCopyUser] = useState();
  const submitNewUser = async () => {
    if (Object.values(newUser).includes("")) {
      return toast.error("Please Fill in all Fields");
    }
    // Api to Submit newUser
    setNewUserData(await addNewUser(newUser));
    toast("User Added Successfully");
  };

  // const [addCustomer] =
  // Handling New Customer Button
  const [addUserOpen, setUserOpen] = useState(false);
  const handleUserOpen = () => {
    setUserOpen(true);
  };
  const handleUserClose = () => {
    setUserOpen(false);
    setNewUserData({});
  };
  return (
    <>
      {" "}
      <div className="m-3 ">
        <Button
          variant="contained"
          color="secondary"
          onClick={handleUserOpen}
          size="large"
        >
          Add Customer
        </Button>
      </div>
      {/* Customer Create Dialog Start */}
      <Toaster richColors />
      <Dialog open={addUserOpen} onClose={handleUserClose}>
        <form>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogContent>
            {newUserData?.data && (
              <>
                <button
                  onClick={() => {
                    // copy(newUserData);
                    return toast("User Details Copied");
                  }}
                  className="text-sm border w-36 bg-red-500 mb-2 rounded p-2 transition"
                >
                  Copy to Send
                </button>
                <br />
                <p>
                  {" "}
                  New {newUserData?.data?.userType} Login is: &nbsp;
                  {newUserData?.data?.userLoginID}
                  <br />
                  Password: {newUserData?.data?.password}
                  <br />
                  Pin: {newUserData?.data?.pin}
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
              onChange={handleUserCreate}
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
              onChange={handleUserCreate}
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
              onChange={handleUserCreate}
              variant="filled"
            />
            {decodedToken.userType == "admin" && (
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  id="userSubAdminPercentage"
                  onChange={handleUserCreate}
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
                  onChange={handleUserCreate}
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
              onClick={handleUserClose}
            >
              {newUserData?.data?.userAllowed ? "close" : "cancel"}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="medium"
              onClick={submitNewUser}
              disabled={newUserData?.data?.userAllowed}
            >
              Set
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Customer Create Dialog End */}
    </>
  );
};

export default CreateUser;
