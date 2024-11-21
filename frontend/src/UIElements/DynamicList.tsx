import Input, { InputType } from "./Forms/Input";
import { ReactSetStateDispatch } from '../Utils/Types';
import { ChangeEvent, FC, MouseEvent, useCallback } from "react";
import Button from "./Buttons/Button";

import "./DynamicList.css";

interface DynamicListProps {
    id: string;
    list: number[];
    setList: ReactSetStateDispatch<number[]>;
    label: string;
    addButtonText: string;
}

const DynamicList: FC<DynamicListProps> = ({
    id,
    list,
    setList,
    label,
    addButtonText,
}) => {
    
    const handleAddItem = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            setList((prevList) => [...prevList, 0]);
        },
        [setList]
    );
    
    const handleRemoveItem = useCallback(
        (event: MouseEvent<HTMLButtonElement>, index: number) => {
            event.preventDefault();
            setList(prevList => prevList.filter((_, i) => i !== index))
        },
        [setList]
    );
    
    const handleValueChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>, index: number, value: number) => {
            event.preventDefault();
            setList(prevList =>
                prevList.map((item, i) => (i === index ? value : item))
            );
        },
        [setList]
    );
    
    return (
    <div className="dynamic-list-container">
        {list.map((item, index) => (
            <div key={index} className="dynamic-list-fields-container">
                <label
                    className="dynamic-list-input-field-label"
                    htmlFor={`${id}-input-${index}`}
                >
                    {`${label} ${index + 1}`}:
                </label>
                <Input
                    id={`${id}-input-${index}`}
                    className="dynamic-list-input-field"
                    type={InputType.Number}
                    value={`${item}`}
                    
                    onChange={(e) => handleValueChange(e, index, Number(e.target.value))}
                />
                <Button
                    className="dynamic-list-remove-btn"
                    onClick={(e) => handleRemoveItem(e, index)}
                >
                    -
                </Button>
            </div>
        ))}
        <Button
            className="dynamic-list-add-item-btn"
            onClick={handleAddItem}
        >
            {addButtonText}
        </Button>
    </div>
    );
};

export default DynamicList;
