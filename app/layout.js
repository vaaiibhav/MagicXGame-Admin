import SidebarWithSearch from "@/Components/SidebarWithSearch";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Magic X Games",
  description: "Developed by Vaaiibhav",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarWithSearch user="Vaaiibhav" /> {children}
      </body>
    </html>
  );
}
