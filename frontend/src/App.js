import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "./theme";
import Layout from "./scenes/layout";
import Dashboard from "./scenes/dashboard";
import Products from "./scenes/products";
import Customers from "./scenes/customers";
import Transactions from "./scenes/transactions";
import Geography from "./scenes/geography";
import Overview from "./scenes/overview";
import Daily from "./scenes/daily";
import Weekly from "./scenes/weekly";
import Breakdown from "./scenes/breakdown";
import Profile from "./scenes/profile";
import Performance from "./scenes/performance";
import Login from "./scenes/login";
import Logout from "./scenes/Logout";
import NoPage from "./scenes/noPage";
import Notifications from "./scenes/notifications";
import Requests from "./scenes/requests";
import JhandiMunda from "./scenes/gameResult/jhandimunda";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/login" index element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/daily" element={<Daily />} />
              <Route path="/weekly" element={<Weekly />} />
              <Route path="/breakdown" element={<Breakdown />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/jhandimunda" element={<JhandiMunda />} />
            </Route>
            <Route path="*" element={<NoPage />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
