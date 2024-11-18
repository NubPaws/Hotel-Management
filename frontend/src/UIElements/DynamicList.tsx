import Input, { InputType } from "./Forms/Input";

const createHandleAddItem = (
    list: number[],
    setList: React.Dispatch<React.SetStateAction<number[]>>,
): React.MouseEventHandler<HTMLInputElement> => {
    return () => {
        setList([...list, 0]);
    };
};

const handleRemoveItem = (index: number, list: number[], setList: React.Dispatch<React.SetStateAction<number[]>>) => {
    setList(list.filter((_, i) => i !== index));
};

const handleValueChange = (index: number, list: number[], value: number, setList: React.Dispatch<React.SetStateAction<number[]>>) => {
    const newValues = list.map((price, i) => (i === index ? value : price));
    setList(newValues);
};

interface DynamicListProps {
    list: number[];
    setList: React.Dispatch<React.SetStateAction<number[]>>;
    listId: string;
    itemId: string;
    itemLabel: string;
    itemPlaceHolder: string;
    removeItemId: string;
    addItemId: string;
    addItemButtonValue: string;
}

export const DynamicList: React.FC<DynamicListProps> = (
    { list, setList, listId, itemId, itemLabel, itemPlaceHolder, removeItemId, addItemId, addItemButtonValue }) => (
    <>
        <div id={listId}>
            {list.map((item, index) => (
                <div key={index}>
                    <Input
                        id={itemId}
                        label={itemLabel}
                        type={InputType.Number}
                        placeholder={itemPlaceHolder}
                        value={item.toString()}
                        onChange={(e) => handleValueChange(index, list, Number(e.target.value), setList)}
                    />
                    <Input
                        id={removeItemId}
                        type={InputType.Button}
                        value="Remove"
                        onClick={() => handleRemoveItem(index, list, setList)}
                    />
                </div>
            ))}
        </div>
        <Input
            id={addItemId}
            type={InputType.Button}
            value={addItemButtonValue}
            onClick={createHandleAddItem(list, setList)}
        />
    </>
);