import googleLogo from "@/assets/google_icon.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { server } from "@/connection/backend/backendConnectorSingleton";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");

    console.log("creds", username, password);
    const result = await server.login(username, password);

    if (!result) {
      setLoginError("Invalid username or password");
      return;
    }

    navigate("/dashboard");
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
          <p className=" font-semibold text-xl text-center "> Login</p>

          <div className="flex flex-col  py-8 pb-4 w-60">
            <Input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="mb-4"
              placeholder="Username"
            />
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
            <p className="text-xs mx-auto text-gray-400">Forgot password?</p>
          </div>
          <div className="flex justify-center">
            <p className="text-red-500 font-medium pb-2">{loginError}</p>
          </div>
          <div className="w-full space-y-3">
            <div className="w-full">
              <Button className="w-full" type="submit">
                {" "}
                Sign In
              </Button>
            </div>
            <div className="w-full">
              <Button variant="outline" className="w-full">
                {" "}
                <img
                  alt="google logo"
                  className="size-6 mr-2"
                  src={googleLogo}
                />
                <span>Sign In with Google</span>
              </Button>
            </div>
            <div className="w-full flex mt-4 flex-col space-y-2">
              <p className="text-xs mx-auto">
                Dont'have an account?{" "}
                <span
                  onClick={() => navigate("/register")}
                  className="font-bold cursor-pointer"
                >
                  {" "}
                  Sign Up{" "}
                </span>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
