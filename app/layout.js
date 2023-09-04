import SidebarWithSearch from "@/Components/SidebarWithSearch";
import "./globals.css";
import { Inter } from "next/font/google";
import Login from "@/Components/Login";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blue Fighter Admin Panel",
  description: "Developed by Vaaiibhav",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <SidebarWithSearch user="Vaaiibhav" /> {children} */}

        {<Login />}
      </body>
    </html>
  );
}
