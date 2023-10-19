import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  MenuItem,
  DialogTitle,
  TextField,
  Select,
} from "@mui/material";
import { Toaster, toast } from "sonner";
import { useAddNotificationMutation } from "../../state/api";

const CreateNotification = () => {
  const [notifyDialog, setNotifyDialog] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [notificationType, setNotificationType] = useState("all");
  const [addNotification] = useAddNotificationMutation();
  const handleNotificationCreate = (evt) => {
    if (evt.target.name == "notificationType") {
      setNotificationType(evt.target.value);
    } else {
      setNotificationText(evt.target.value);
    }
  };

  const submitNewNotification = () => {
    if (
      notificationText == "" ||
      notificationText == undefined ||
      notificationType == "" ||
      notificationType == undefined
    ) {
      return toast.error("Please Input Notification");
    }
    addNotification({ notificationText, notificationType });
    toast("Notification Added Successfully");
    setNotifyDialog(false);
  };
  return (
    <>
      {""}
      <div className="m-3 ">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setNotifyDialog(true);
          }}
          size="large"
        >
          Create Notification
        </Button>
      </div>
      {/* Notification Create Dialog Start */}
      <Toaster richColors />
      <Dialog
        open={notifyDialog}
        onClose={() => {
          setNotifyDialog(false);
        }}
        fullWidth
      >
        <form>
          <DialogTitle>Create New Notification</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="notificationText"
              name="notificationText"
              label="Notification Text"
              onChange={handleNotificationCreate}
              multiline
              rows={4}
              fullWidth
              variant="standard"
            />
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="User Group"
              value={"all"}
              fullWidth
              name="notificationType"
              onChange={handleNotificationCreate}
            >
              <MenuItem value={"all"}>All</MenuItem>
              <MenuItem value={"subadmin"}>SubAdmins</MenuItem>
              <MenuItem value={"master"}>Masters</MenuItem>
              <MenuItem value={"retailer"}>Retailers</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="secondary"
              size="medium"
              onClick={() => {
                setNotifyDialog(false);
              }}
            >
              Cancel{" "}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="medium"
              onClick={submitNewNotification}
              //   disabled={newUserData?.data?.userAllowed}
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Customer Create Dialog End */}
    </>
  );
};

export default CreateNotification;
