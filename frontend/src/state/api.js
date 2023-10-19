import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URI } from "../Utils/constants";
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: BACKEND_URI, credentials: "include" }),
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Login",
    "AvailUser",
    "Products",
    "Customers",
    "Transactions",
    "Geography",
    "Sales",
    "Admins",
    "Performance",
    "Dashboard",
    "Notifications",
  ],
  endpoints: (build) => ({
    addLogin: build.mutation({
      query: (body) => ({
        url: `login/`,
        method: "POST",
        body,
      }),
      providesTags: ["Login"],
    }),
    addCustomer: build.mutation({
      query: (body) => ({
        url: `users/`,
        method: "POST",
        body,
      }),
      providesTags: ["addCustomer"],
    }),
    editCustomer: build.mutation({
      query: (body) => ({
        url: `users/`,
        method: "UPDATE",
        body,
      }),
      providesTags: ["addCustomer"],
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
      query: ({ userType, userLoginID }) => `users/${userType}/${userLoginID}`,
      invalidatesTags: ["Customers"],
    }),
    getTransactions: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: "client/transactions",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Transactions"],
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
  useGetTransactionsQuery,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
  useAddCustomerMutation,
  useAddLoginMutation,
} = api;
