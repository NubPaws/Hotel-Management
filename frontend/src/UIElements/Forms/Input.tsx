import React, { ChangeEventHandler, MouseEventHandler } from "react";
import './Input.css'

export enum InputType {
    Button = "button",
    Checkbox = "checkbox",
    Color = "color",
    Date = "date",
    DatetimeLocal = "datetime-local",
    Email = "email",
    File = "file",
    Hidden = "hidden",
    Image = "image",
    Month = "month",
    Number = "number",
    Password = "password",
    Radio = "radio",
    Range = "range",
    Reset = "reset",
    Search = "search",
    Submit = "submit",
    Tel = "tel",
    Text = "text",
    Time = "time",
    Url = "url",
    Week = "week",
}

interface InputProps {
    id: string;
    type: InputType;
    label?: string;
    value?: string;
    placeholder?: string;
    hint?: string;
    isRequired?: boolean;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onClick?: MouseEventHandler<HTMLInputElement>;
}

const Input: React.FC<InputProps> = ({ id, label, type, value, placeholder, hint, isRequired = true, onChange, onClick }) => (
    <div className="input-field-wrapper">
        {label && (
            <label htmlFor={id} className="input-label">
                {label}
            </label>)
        }
        <input
            id={id}
            className="input-field"
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onClick={onClick}
            required={isRequired}
        />
        {hint && (
            <span className="input-hint">{hint}</span>
        )}
    </div>
);

export default Input;
