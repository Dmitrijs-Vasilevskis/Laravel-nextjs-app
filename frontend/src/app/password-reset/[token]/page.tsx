"use client";

import { useSearchParams } from "next/navigation";
import { useAuth } from "../../hooks/auth";
import { useEffect, useState } from "react";
import { Input, Button } from "@material-tailwind/react";

export default function page() {
  const searchParams = useSearchParams();

  const { resetPassword } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/",
  });

  const [email, setEmail] = useState<string | null>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setEmail(searchParams.get("email"));
  }, [searchParams.get("email")]);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    resetPassword({
      email,
      password,
      password_confirmation: confirmPassword,
      setErrors,
      setStatus,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
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
            Reset Password
          </Button>
        </div>
      </form>
    </div>
  );
}
