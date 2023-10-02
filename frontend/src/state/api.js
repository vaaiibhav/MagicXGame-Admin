import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URI } from "../Utils/constants";
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: BACKEND_URI }),
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
  ],
  endpoints: (build) => ({
    // getUser: build.query({
    //   query: (id) => `/users/${id}`,
    //   providesTags: ["User"],
    // }),
    addLogin: build.mutation({
      query: (body) => ({
        url: `post`,
        method: "POST",
        body,
      }),
      providesTags: ["Login"],
    }),
    addCustomer: build.mutation({
      query: (body) => ({
        url: `post`,
        method: "POST",
        body,
      }),
      providesTags: ["Login"],
    }),
    getAvailUser: build.query({
      query: ({ userType, userID }) => `/users/avail/${userType}/${userID}`,
      providesTags: ["AvailUser"],
    }),
    getProducts: build.query({
      query: () => "client/products",
      providesTags: ["Products"],
    }),
    getCustomers: build.query({
      query: ({ userType, userID }) => `users/${userType}/${userID}`,
      providesTags: ["Customers"],
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
  useGetUserQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
  useGetAvailUserQuery,
  useAddLoginMutation,
} = api;
