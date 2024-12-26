"use client";

import { useAuth } from "@/app/hooks/auth";
import React, { useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { AuthFormType } from "@/types/Auth/Auth";

interface Props {
  handleFormType: (newFormType: AuthFormType) => void;
}

export default function ForgotPasswordForm({ handleFormType }: Props) {
  const { forgotPassword } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/",
  });

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);

  const onFormSubmit = (e: any) => {
    e.preventDefault();

    forgotPassword({ email, setErrors, setStatus }).then(() => {
      if (status) {
        toast.success(status);
      }
    });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="align-center">
        <h3 className="text-2xl font-bold mb-4 text-white ">
          Email Password Reset
        </h3>

        <p className="text-l font-normal mb-4 text-white ">
          Forgot your password? No problem. Just let us know your email address
          and we will email you a password reset link that will allow you to
          choose a new one.
        </p>
      </div>
      <form onSubmit={onFormSubmit}>
        <div className="flex flex-col gap-3">
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
        </div>
        <div className="flex flex-col justify-center pt-4">
          <Button type="submit" color="gray">
            Email Password Reset Link
          </Button>
        </div>
      </form>
    </div>
  );
}
