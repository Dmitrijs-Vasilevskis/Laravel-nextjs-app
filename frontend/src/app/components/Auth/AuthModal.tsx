"use client";

import { useGlobalState } from "@/app/context/globalProvider";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useState } from "react";
import styled from "styled-components";

interface Props {
  handleOpenAuthModal: () => void;
}

export default function AuthModal({ handleOpenAuthModal }: Props) {
  const { isLoggedIn, setIsLoggedIn } = useGlobalState();
  const [formType, setFormType] = useState("login");

  const handleFormType = (newFormType: string) => {
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

  return (
    <ModalStyled>
      <div className="modal-overlay" onClick={handleOpenAuthModal}></div>
      <div className="absolute -ml-40 -mt-40 w-80 h-auto p-4 left-1/2 top-1/2 border border-gray-600 rounded-lg bg-gray-700">
        {renderForm()}
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
