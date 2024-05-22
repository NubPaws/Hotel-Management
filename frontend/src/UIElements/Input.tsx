import { ChangeEventHandler } from "react";
import './Input.css'

export function Input(props : {className: string,
                               id: string,
                               children: React.ReactNode,
                               type: string,
                               name: string,
                               placeholder: string,
                               onChange?: ChangeEventHandler<HTMLInputElement>,
                            }) {
    return (
        <div className={props.className}>
            <label className="fieldLabel" htmlFor={props.id}>{props.children}</label>
            <div className="fieldInputContainer">
                <input className="fieldInput" type={props.type}  name={props.name} id={props.id}
                    placeholder={props.placeholder} onChange={props.onChange} required/>
            </div>
        </div>
    );
}