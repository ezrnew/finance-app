import { cookies, getCookie } from "@/utils/cookies";
import React from "react";
import { Navigate } from "react-router-dom";

export const AuthorizedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  if (getCookie(cookies.auth) !== "true") return <Navigate to="/login" />;

  return children;
};
