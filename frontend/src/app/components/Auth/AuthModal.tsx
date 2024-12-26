"use client";

import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { AuthFormType } from "@/types/Auth/Auth";

interface Props {
    handleOpenAuthModal: () => void;
    preselectedFormType: AuthFormType | null;
}

export default function AuthModal({
    handleOpenAuthModal,
    preselectedFormType,
}: Props) {
    const [formType, setFormType] = useState<AuthFormType>("login");

    useMemo(() => {
        if (preselectedFormType) {
            setFormType(preselectedFormType);
        }
    }, [preselectedFormType]);

    const handleFormType = (newFormType: AuthFormType) => {
        setFormType(newFormType);
    };

    const renderForm = () => {
        switch (formType) {
            case "login":
                return <LoginForm handleFormType={handleFormType} />;
            case "register":
                return <RegistrationForm handleFormType={handleFormType} />;
            case "forgotPassword":
                return <ForgotPasswordForm handleFormType={handleFormType} />;
            default:
                return <LoginForm handleFormType={handleFormType} />;
        }
    };

    const formComponents: Record<AuthFormType, JSX.Element> = {
        login: <LoginForm handleFormType={handleFormType} />,
        register: <RegistrationForm handleFormType={handleFormType} />,
        forgotPassword: <ForgotPasswordForm handleFormType={handleFormType} />,
    };

    return (
        <ModalStyled>
            <div className="modal-overlay" onClick={handleOpenAuthModal}></div>
            <div className="absolute -ml-40 -mt-40 w-80 h-auto p-4 left-1/2 top-1/2 border border-gray-600 rounded-lg bg-gray-700">
                {formComponents[formType]}
            </div>
        </ModalStyled>
    );
}

const ModalStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;

  .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.45);
    filter: blur(4px);
  }
`;
