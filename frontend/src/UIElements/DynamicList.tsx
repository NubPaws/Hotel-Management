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
    totalText?: string;
    addButtonText: string;
    maxHeight?: string;
}

const DynamicList: FC<DynamicListProps> = ({
    id,
    list,
    setList,
    label,
    totalText = "Total",
    addButtonText,
    maxHeight = "200px",
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
        <div className="dynamic-list-controls">
            <span>{totalText}: {list.length}</span>
            <Button
                onClick={handleAddItem}
            >
                {addButtonText}
            </Button>
        </div>
        
        <div className="dynamic-list-scrollable" style={{maxHeight}}>
        {list.map((item, index) => (
            <div key={index} className="dynamic-list-fields-container">
                <label htmlFor={`${id}-input-${index}`} style={{fontSize: "16pt"}}>{`${label} ${index + 1}`}:</label>
                <Input
                    id={`${id}-input-${index}`}
                    type={InputType.Number}
                    value={`${item}`}
                    
                    onChange={(e) => handleValueChange(e, index, Number(e.target.value))}
                />
                <Button onClick={(e) => handleRemoveItem(e, index)}>-</Button>
            </div>
        ))}
        </div>
    </div>
    );
};

export default DynamicList;
