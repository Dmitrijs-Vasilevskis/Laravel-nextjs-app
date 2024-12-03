"use client";

import { useSearchParams } from "next/navigation";
import { useAuth } from "../../hooks/auth";
import { useEffect, useState } from "react";
import { Input, Button } from "@material-tailwind/react";
import styled from "styled-components";

export default function page() {
    const searchParams = useSearchParams();

    const { resetPassword } = useAuth({
        middleware: "guest",
        redirectIfAuthenticated: "/",
    });

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const emailParam = searchParams.get("email");
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

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
        <PageStyled className="main-container">
            <h1 className=" text-white text-center">Reset Password</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <div className="form-input-wrapper">
                        <Input
                            label="Email"
                            color="white"
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={email}
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            crossOrigin={"anonymous"}
                        />
                    </div>
                    <div className="form-input-wrapper">
                        <Input
                            label="Password"
                            color="white"
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={password}
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            crossOrigin={"anonymous"}
                        />
                    </div>
                    <div className="form-input-wrapper">
                        <Input
                            label="Password confirm"
                            color="white"
                            type="password"
                            placeholder="Password confirm"
                            name="confirmPassword"
                            value={confirmPassword}
                            id="confirmPassword"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            crossOrigin={"anonymous"}
                        />
                    </div>
                </div>
                <div className=" flex flex-col justify-center">
                    <Button className="btn-primary" type="submit" color="gray">
                        Reset Password
                    </Button>
                </div>
            </form>
        </PageStyled>
    );
}

const PageStyled = styled.section`
    justify-content: center;
    flex-direction: column;

    h1 {
        font-size: 1.5rem;
        line-height: 2rem;
        font-weight: 600;
        text-align: center;
        margin-bottom: 1rem;
    }

    .form-input-wrapper {
        margin-bottom: 1rem;
    }
`;
