import { useState, useEffect } from "react";
import { backendUrl } from "../exports";

const TokenVerification = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch(`${backendUrl}auth/verify-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });
          if (response.ok) {
            setIsLoggedIn(true);
          } else {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking token:", error);
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  return { isLoading, isLoggedIn };
};

export default TokenVerification;
