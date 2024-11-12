// children = { undefined } placeholder = { undefined } onPointerEnterCapture = { undefined } onPointerLeaveCapture = { undefined }

import MaterialTailwind from '@material-tailwind/react'

declare module '@material-tailwind/react' {
    interface ButtonProps {
        placeholder?
        children?
        onPointerEnterCapture?
        onPointerLeaveCapture?
    }

    interface NavbarProps {
        placeholder?
        fullWidth?
        children?
        onPointerEnterCapture?
        onPointerLeaveCapture?
    }

    interface TypographyProps {
        placeholder?
        children?
        onPointerEnterCapture?
        onPointerLeaveCapture?
    }

    interface IconButtonProps {
        children?
        placeholder?
        onPointerEnterCapture?
        onPointerLeaveCapture?
    }

    interface InputProps {
        onPointerEnterCapture?
        onPointerLeaveCapture?
    }
}