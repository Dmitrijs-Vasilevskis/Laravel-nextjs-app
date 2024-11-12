"use client";

import React from "react";
import styled from "styled-components";
import { HexColorPicker } from "react-colorful";
import { Input } from "@material-tailwind/react";

interface Props {
  handleColorChange: (color: string) => void;
  color: string;
  getTextColorStyle: () => { color: string };
}

export default function NicknameColorInput({
  handleColorChange,
  color,
  getTextColorStyle,
}: Props) {
  return (
    <ColorPickerStyle className="color-picker">
      <HexColorPicker
        color={color}
        onChange={(newColor: string) => handleColorChange(newColor)}
      />
      <Input
        className="bg-gray-50"
        type="text"
        value={color}
        label="Hex Color"
        crossOrigin={"anonymous"}
        style={getTextColorStyle()}
        onChange={(e: any) => handleColorChange(e.target.value)}
      />
    </ColorPickerStyle>
  );
}

const ColorPickerStyle = styled.div`
  position: absolute;
  transform: translate(0%, -15%);
  right: 0;
  bottom: 0;
  padding: 10px;
  background-color: #efeff1;
  border: 1px solid #ccc;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
