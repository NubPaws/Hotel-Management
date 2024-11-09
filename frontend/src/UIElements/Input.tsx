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
    label?: string;
    type: InputType;
    value?: string;
    placeholder?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onClick?: MouseEventHandler<HTMLInputElement>;
}

export const Input: React.FC<InputProps> = ({ id, label, type, value, placeholder, onChange, onClick }) => (
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
            required
        />
    </div>
);
