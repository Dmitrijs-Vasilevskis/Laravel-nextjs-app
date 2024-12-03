"use client";

import { useGlobalState } from "@/app/context/globalProvider";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Input, Button, Typography } from "@material-tailwind/react";
import { image, paletteIcon } from "@/app/utils/icons";
import { axios } from "@/app/lib/axios";
import toast from "react-hot-toast";
import NicknameColorInput from "@/app/components/ColorPicker/ColorPicker";
import { UserInterface } from "@/types/User/User";
export default function MyProfile() {
    const { user } = useGlobalState();

    const [formdata, setFormData] = useState({
        username: user?.name || "",
        email: user?.email || "",
        password: "",
        confirmPassword: "",
        profilePicture: null,
        nicknameColor: user?.chat_name_color,
    });

    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [color, setColor] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const isValidHex = (color: string) =>
        /^#([A-Fa-f0-9]{3}){1,2}$/.test(color);

    const handleOpenColorPicker = () => {
        setIsColorPickerOpen(!isColorPickerOpen);
    };

    const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));

        if (name === "profilePicture" && files && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };

            reader.readAsDataURL(files[0]);
        }
    };

    const handleUpdateProfilePicture = () => {
        if (!formdata.profilePicture)
            return toast.error("Please select an image");

        axios
            .post(
                "api/user-update-profile-image",
                {
                    id: user?.id,
                    profile_picture: formdata.profilePicture,
                },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            )
            .then((res) => {
                if (res.status === 200) {
                    toast.success("Profile picture updated successfully");
                }
            });
    };

    const handleUpdateNicknameColor = () => {
        if (!color) return toast.error("Please select a color");

        if (!isValidHex(color)) return toast.error("Invalid HEX color");

        axios
            .post("api/user-update-profile", {
                id: user?.id,
                nicknameColor: color,
            })
            .then((res) => {
                if (res.status === 200) {
                    toast.success("Nickname color updated successfully");
                    handleOpenColorPicker();
                }
            });
    };

    const handleColorChange = (color: string) => {
        setColor(color);
    };

    const getTextColorStyle = () => {
        return {
            color: color ?? user.chat_name_color,
        };
    };

    useEffect(() => {
        if (user) {
            const { chat_name_color, profile_picture_url } = user;

            setImagePreview(profile_picture_url);
            setColor(chat_name_color);
        }
    }, [user]);

    return (
        <MyAccountStyled className="main-wrapper">
            {/* Profile Picture section*/}
            <div className="section-tab ">
                <div className="section-header">
                    <Typography variant="h3">Profile Picture</Typography>
                </div>
                <div className="section-item-container">
                    <div className="image-preview-container">
                        {imagePreview ? (
                            <img
                                className="h-24 w-24 rounded-full object-cover object-center"
                                src={imagePreview}
                                alt="profile picture preview"
                                width={100}
                                height={100}
                            />
                        ) : (
                            <div className="image-preview-icon">{image}</div>
                        )}
                    </div>
                    <div className="section-item-content flex-col">
                        <div className="section-item-actions gap-2">
                            <Input
                                className="section-input"
                                type="file"
                                label="Profile picture"
                                name="profilePicture"
                                onChange={handlechange}
                                crossOrigin={"anonymous"}
                                accept="image/*"
                            />
                            <Button
                                onClick={handleUpdateProfilePicture}
                                className="btn-primary flex-shrink-0"
                            >
                                <span>Update Profile Picture</span>
                            </Button>
                        </div>
                        <span className="mt-4">
                            Must be JPEG or PNG and cannot exceed 10MB.
                        </span>
                    </div>
                </div>
            </div>
            {/* User section */}
            <div className="section-tab">
                <div className="section-header">
                    <Typography variant="h3">Profile Settings</Typography>
                </div>
                <div className="section-item-container">
                    <div className="section-item-content">
                        <div className="section-item-header">
                            <span>Email</span>
                        </div>
                        <Input
                            className="section-input"
                            crossOrigin={"anonymous"}
                            defaultValue={user?.email}
                            type="text"
                            label="Email"
                            name="email"
                            readOnly
                            disabled
                        />
                    </div>
                </div>
                <div className="section-item-container">
                    <div className="section-item-content">
                        <div className="section-item-header">
                            <span>Username</span>
                        </div>
                        <Input
                            className="section-input"
                            crossOrigin={"anonymous"}
                            defaultValue={user?.name}
                            type="text"
                            label="UserName"
                            name="userName"
                            readOnly
                            disabled
                        />
                    </div>
                </div>

                {/*Chat setting tab */}
                <div className="section-tab">
                    <div className="section-header">
                        <Typography variant="h3">
                            Chat settings & customizations
                        </Typography>
                    </div>
                    <div className="section-item-container">
                        <div className="section-item-header">
                            <span>Username color </span>
                        </div>
                        <div className="section-item-content flex-row gap-2">
                            <div className="flex relative grow">
                                {isColorPickerOpen && (
                                    <NicknameColorInput
                                        handleColorChange={handleColorChange}
                                        color={color}
                                        getTextColorStyle={getTextColorStyle}
                                    />
                                )}
                                <Input
                                    crossOrigin={"anonymous"}
                                    defaultValue={user?.name}
                                    label="Color sample"
                                    type="text"
                                    style={getTextColorStyle()}
                                    name="userNameColor"
                                    readOnly
                                />
                                <button
                                    className="palette-icon"
                                    onClick={handleOpenColorPicker}
                                >
                                    {paletteIcon}
                                </button>
                            </div>

                            <div className="section-item-actions">
                                <Button
                                    onClick={handleUpdateNicknameColor}
                                    className="btn-primary flex-shrink-0"
                                >
                                    <span>Update Chat Nickname Color</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MyAccountStyled>
    );
}

const MyAccountStyled = styled.div`
    .main-wrapper {
        width: 100%;
    }

    .section-header {
        margin: 1rem 0;
    }

    .section-item-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 1rem;
    }

    .section-item-content {
        margin: 0 1rem;
        display: flex;
        width: 100%;
    }

    .section-item-actions {
        display: flex;
    }

    .section-input {
        width: 100%;
    }

    .image-preview-container {
        min-width: 6rem;
        align-content: center;
    }

    .image-preview-icon {
        font-size: 63px;
        text-align: center;
        border: 1px solid black;
        border-radius: 9999px;
        // display: flex;
        // justify-content: center;
    }

    .section-item-header {
        align-content: center;
        width: 18rem;
    }

    .palette-icon {
        position: absolute;
        height: 100%;
        right: 0;
        padding-right: 20px;
    }
`;
