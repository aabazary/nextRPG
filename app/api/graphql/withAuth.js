"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [token, setToken] = useState(null);
    const router = useRouter();

    useEffect(() => {

      if (typeof window !== "undefined") {
        const authToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("authToken="))
          ?.split("=")[1];
        setToken(authToken);

        if (!authToken) {
          router.push("/login");
        }
      }
    }, [router]);

    if (!token) {
      return null; 
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;

