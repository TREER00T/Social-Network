import {Input} from "@material-tailwind/react";
import {useState} from "react";

function EditText({getText, label, className, ref, type, maxLength, minLength, disabled}) {

    let [text, setText] = useState('');

    const editTextHandler = (e) => {
        const {value} = e.target;
        setText(value);
        getText(value);
    };

    return (
        <div ref={ref} className={className + " flex items-end gap-4"}>
            <Input variant="outlined"
                   label={label}
                   value={text}
                   type={type}
                   disabled={disabled}
                   minLength={minLength}
                   maxLength={maxLength}
                   onChange={editTextHandler}/>
        </div>
    );
}

export default EditText;