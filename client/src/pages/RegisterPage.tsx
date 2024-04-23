import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { server } from "@/connection/backend/backendConnectorSingleton";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const RegisterPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError("");
    setUsernameError("");
    setPasswordError("");

    const result = await server.register(email, username, password);

    if (result.success) {
      //todo some popup with success info
      navigate("/login");
    }

    if (result.error === "email") setEmailError("Email already in use");
    else if (result.error === "username")
      setUsernameError("Username already in use");
  };

  return (
    <div className="flex h-screen  w-full bg-stone-200  ">
      <form
        onSubmit={(e) => {
          submitForm(e);
        }}
        className="bg-white p-8 py-4 rounded-xl m-auto"
      >
        <div>
          <p className=" font-semibold text-xl text-center "> Register</p>

          <div className="flex flex-col  py-8 pb-4 w-60 space-y-3">
            <div>
              <Input
                value={email}
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className=""
                placeholder="Email"
              />
              <p className="text-red-500 font-medium py-1  ml-2">
                {emailError}
              </p>
            </div>

            <div>
              <Input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                className=""
                placeholder="Username"
              />
              <p className="text-red-500 font-medium py-1  ml-2">
                {usernameError}
              </p>
            </div>

            <Input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="mb-1"
              type="password"
              placeholder="Password"
            />

            {/*//todo */}
          </div>
          <div className="flex justify-center"></div>
          <div className="w-full space-y-3">
            <div className="w-full">
              <Button className="w-full" type="submit">
                {" "}
                Sign Up
              </Button>
            </div>
            <div className="w-full"></div>
            <div className="w-full flex mt-4 flex-col space-y-2"></div>
          </div>
        </div>
      </form>
    </div>
  );
};
