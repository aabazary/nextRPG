"use client";

import Navbar from "../components/Navbar";
import "./globals.css";
import { ApolloProvider } from "@apollo/client";
import client from "@/utils/apolloClient";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Next RPG</title>
      </head>
       <body className="bg-gray-100 text-gray-900 flex flex-col min-h-screen">
        <ApolloProvider client={client}>
          <Navbar />
          <main className="flex-grow container mx-auto p-6">{children}</main>
        </ApolloProvider>
        <Footer/>
      </body>
    </html>
  );
}
