"use client"; 

import Navbar from "../components/Navbar";
import "./globals.css";
import { ApolloProvider } from "@apollo/client";
import client from "@/utils/apolloClient";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <ApolloProvider client={client}>
          <Navbar />
          <main className="container mx-auto p-4">{children}</main>
        </ApolloProvider>
      </body>
    </html>
  );
}
