import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import jwtDecode from "jwt-decode";
import { useAddCustomerMutation } from "../../state/api";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { gameName } from "../../Utils/constants";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
const CreateUser = () => {
  const dontAllow = ["-", "+", "e", "*", "/", "`", "!", ""];
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
  });
  const handleUserCreate = (evt) => {
    let value = evt.target.value;
    const name = evt.target.name;
    if (
      name === "userSubAdminPercentage" ||
      name === "userMasterPercentage" ||
      name === "userPhoneNumber"
    ) {
      if (dontAllow.includes(value)) {
        return evt.preventDefault();
      }
    }
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  //  create new Customer
  const [addNewUser] = useAddCustomerMutation();
  const submitNewUser = async () => {
    if (
      newUser?.userName === "" ||
      newUser?.userCity === "" ||
      newUser?.userPhoneNumber === "" ||
      (decodedToken?.userType === "admin" &&
        (newUser?.userSubAdminPercentage === "" ||
          newUser?.userMasterPercentage === ""))
    ) {
      return toast.error("Please Fill in all Fields");
    }
    // Api to Submit newUser
    const serverNewUserData = await addNewUser(newUser);
    if (serverNewUserData?.error)
      return toast.error(serverNewUserData?.error?.data?.error);
    setNewUserData(serverNewUserData);
    toast("User Added Successfully");
  };

  // const [addCustomer] =
  // Handling New Customer Button
  const [addUserOpen, setUserOpen] = useState(false);
  const handleUserOpen = () => {
    setUserOpen(true);
  };
  const onCopy = () => {
    toast("User Details Copied");
    // handleUserClose();
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
                <CopyToClipboard
                  onCopy={onCopy}
                  text={`Welcome to ${gameName} New ${newUserData?.data?.userType} Login is: ${newUserData?.data?.userLoginID}   Password: ${newUserData?.data?.password}   Pin: ${newUserData?.data?.pin}`}
                >
                  <button className="text-sm border w-36 bg-red-500 mb-2 rounded p-2 transition">
                    Copy
                  </button>
                </CopyToClipboard>
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
              onChange={handleUserCreate}
              variant="filled"
            />
            {decodedToken.userType === "admin" && (
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  id="userSubAdminPercentage"
                  onChange={handleUserCreate}
                  name="userSubAdminPercentage"
                  label="Sub Admin Percentage"
                  type="number"
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
