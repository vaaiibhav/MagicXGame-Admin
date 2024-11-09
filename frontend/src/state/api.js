import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URI } from "../Utils/constants";
import Cookies from "universal-cookie";
import { gudGudiToken } from "../Utils/constants";

const cookies = new Cookies();

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URI,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = cookies.get(gudGudiToken); // Use your selector to get the token from the Redux store
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  }),
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Login",
    "AvailUser",
    "Products",
    "Customers",
    "Transactions",
    "Requests",
    "Geography",
    "Sales",
    "Admins",
    "Performance",
    "Dashboard",
    "Notifications",
    "Balance",
  ],
  endpoints: (build) => ({
    addLogin: build.mutation({
      query: (body) => ({
        url: `login/`,
        method: "POST",
        body,
      }),
      providesTags: ["Login"],
      invalidatesTags: ["Balance"],
    }),
    addCustomer: build.mutation({
      query: (body) => ({
        url: `users/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customers"],
    }),
    editCustomer: build.mutation({
      query: (body) => ({
        url: `users/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Customers"],
    }),
    editPin: build.mutation({
      query: (body) => ({
        url: `login/pin-change`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customers"],
    }),
    getNotifications: build.query({
      query: () => `notifications/`,
      providesTags: ["Notifications"],
    }),
    addNotification: build.mutation({
      query: (body) => ({
        url: `notifications/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notifications"],
    }),
    deleteNotification: build.mutation({
      query: (notificationID) => ({
        url: `notifications/${notificationID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
    getProducts: build.query({
      query: () => "client/products",
      providesTags: ["Products"],
    }),
    getCustomers: build.query({
      query: () => `users/`,
      invalidatesTags: ["Customers"],
    }),
    getTransactions: build.query({
      query: () => `transactions`,
      providesTags: ["Transactions"],
    }),
    addTransaction: build.mutation({
      query: (body) => ({
        url: `transactions/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Transactions", "Balance"],
    }),
    getBalance: build.query({
      query: () => "users/user-balance",
      providesTags: ["Balance"],
    }),
    getRequests: build.query({
      query: () => "requests",
      providesTags: ["Requests"],
    }),
    getGeography: build.query({
      query: () => "client/geography",
      providesTags: ["Geography"],
    }),
    getSales: build.query({
      query: () => "sales/sales",
      providesTags: ["Sales"],
    }),
    getAdmins: build.query({
      query: () => "management/admins",
      providesTags: ["Admins"],
    }),
    getUserPerformance: build.query({
      query: (id) => `management/performance/${id}`,
      providesTags: ["Performance"],
    }),
    getJhandiMundabets: build.query({
      query: () => "game-result/jhandimunda",
      providesTags: ["jhandimunda"],
    }),
    getDashboard: build.query({
      query: () => "general/dashboard",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useEditCustomerMutation,
  useGetProductsQuery,
  useGetNotificationsQuery,
  useAddNotificationMutation,
  useDeleteNotificationMutation,
  useGetCustomersQuery,
  useEditPinMutation,
  useGetTransactionsQuery,
  useAddTransactionMutation,
  useGetBalanceQuery,
  useGetRequestsQuery,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useGetJhandiMundabetsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
  useAddCustomerMutation,
  useAddLoginMutation,
} = api;
