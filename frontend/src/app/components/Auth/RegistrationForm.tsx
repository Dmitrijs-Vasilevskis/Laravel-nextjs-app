"use client";

import { Button, Input } from "@material-tailwind/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/app/hooks/auth";
import { useGlobalState } from "@/app/context/globalProvider";

interface Props {
  handleFormType: (newFormType: string) => void;
}

export default function RegistrationForm({ handleFormType }: Props) {
  const { register } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/",
  });

  const { user, handleOpenAuthModal } = useGlobalState();

  const [userName, setUserName] = useState("Dmitrijs");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const validateForm = () => {
    let isValid = true;

    if (!userName) {
      toast.error("Username is required");
      isValid = false;
    }

    if (!email) {
      toast.error("Email is required");
      isValid = false;
    }

    if (!password) {
      toast.error("Password is required");
      isValid = false;
    }

    if (!confirmPassword) {
      toast.error("Confirm Password is required");
      isValid = false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  const onFormSubmit = (e: any) => {
    e.preventDefault();

    if (validateForm()) {
      register({
        name,
        email,
        password,
        password_confirmation: confirmPassword,
        setErrors,
      }).then(() => {
        if (user) {
          handleOpenAuthModal();
        }
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="align-center">
        <h3 className="text-2xl font-bold mb-4 text-white ">Login</h3>
      </div>
      <form onSubmit={onFormSubmit}>
        <div className="flex flex-col gap-3">
          <Input
            label="Username"
            color="white"
            type="text"
            placeholder="Username"
            name="username"
            id="username"
            onChange={(e) => setUserName(e.target.value)}
            crossOrigin={"anonymous"}
          />
          <Input
            label="Email"
            color="white"
            type="email"
            placeholder="Email"
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            crossOrigin={"anonymous"}
          />
          <Input
            label="Password"
            color="white"
            type="password"
            placeholder="Password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            crossOrigin={"anonymous"}
          />
          <Input
            label="Password confirm"
            color="white"
            type="password"
            placeholder="Password confirm"
            name="confirmPassword"
            id="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            crossOrigin={"anonymous"}
          />
        </div>
        <div className="flex flex-col justify-center pt-4">
          <Button type="submit" color="gray">
            Registration
          </Button>
          <div className="text-white text-center mt-2 font-normal text-sm flex flex-col">
            <span>Already have an account?</span>
            <a
              className="cursor-pointer"
              onClick={() => handleFormType("login")}
            >
              Sign in
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
