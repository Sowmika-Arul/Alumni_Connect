import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`http://localhost:5050/verify-email/${token}`);
        const data = await response.json();

        if (response.ok) {
          setMessage("Email verified successfully. You can now set your password.");
        } else {
          setMessage(data.message || "Invalid or expired token.");
        }
      } catch (error) {
        setMessage("An error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>{message}</div>;
};

export default VerifyEmail;
