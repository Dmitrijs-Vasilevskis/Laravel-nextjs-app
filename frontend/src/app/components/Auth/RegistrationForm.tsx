"use client";

import { Button, Input } from "@material-tailwind/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/app/hooks/auth";
import { useGlobalState } from "@/app/context/globalProvider";
import { AuthFormType } from "@/types/Auth/Auth";

interface Props {
  handleFormType: (newFormType: AuthFormType) => void;
}

interface FormData {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function RegistrationForm({ handleFormType }: Props) {
  const { register } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/",
  });

  const { user, handleOpenAuthModal } = useGlobalState();

  const [formData, setFormData] = useState<FormData>({
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
  });

  const [errors, setErrors] = useState([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let isValid = true;

    if (!formData.userName) {
        toast.error("Username is required");
        isValid = false;
    }

    if (!formData.email) {
        toast.error("Email is required");
        isValid = false;
    }

    if (!formData.password) {
        toast.error("Password is required");
        isValid = false;
    }

    if (!formData.confirmPassword) {
        toast.error("Confirm Password is required");
        isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        isValid = false;
    }

    return isValid;
  };

  const onFormSubmit = (e: any) => {
    e.preventDefault();

    if (validateForm()) {
      register({
          name: formData.userName,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          setErrors,
      }).then(() => {
          handleOpenAuthModal();
      });
    }
  };

  return (
      <div className="w-full h-full flex flex-col">
          <div className="align-center">
              <h3 className="text-2xl font-bold mb-4 text-white ">Registration </h3>
          </div>
          <form onSubmit={onFormSubmit}>
              <div className="flex flex-col gap-3">
                  <Input
                      label="Username"
                      color="white"
                      type="text"
                      placeholder="Username"
                      name="userName"
                      id="username"
                      autoComplete="username"
                      value={formData.userName}
                      onChange={handleChange}
                      crossOrigin={"anonymous"}
                  />
                  <Input
                      label="Email"
                      color="white"
                      type="email"
                      placeholder="Email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      crossOrigin={"anonymous"}
                  />
                  <Input
                      label="Password"
                      color="white"
                      type="password"
                      placeholder="Password"
                      name="password"
                      id="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      crossOrigin={"anonymous"}
                  />
                  <Input
                      label="Password confirm"
                      color="white"
                      type="password"
                      placeholder="Password confirm"
                      name="confirmPassword"
                      id="confirmPassword"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
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
