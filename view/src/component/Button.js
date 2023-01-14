import {Button} from "@material-tailwind/react";

function Btn({children, className, disabled, onClick, variant, color}) {
    return (
        <Button onClick={onClick}
                color={color}
                variant={variant}
                className={className + ` normal-case ${color ? '' : 'bg-blue-100'}`}
                disabled={disabled}>
            {children}
        </Button>
    );
}

export default Btn;