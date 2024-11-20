import { ChangeEvent, FC, MouseEvent } from "react";
import Input, { InputType } from "./Input";

type DateInputProps = {
	id: string;
	className?: string;
	label?: string;
	value: Date;
	placeholder?: string;
	hint?: string;
	required?: boolean;
	
	onChange?: (year: number, month: number, day: number) => void;
	onClick?: (event: MouseEvent<HTMLInputElement>) => void;
};

const DateInput: FC<DateInputProps> = ({
	id,
    className = "",
    label = "",
    value = new Date(),
    placeholder = "",
    hint = "",
    required = false,
    onChange = () => {},
    onClick = () => {},
}) => {
	const day = padL(value.getDate(), 2);
	const month = padL(value.getMonth() + 1, 2);
	const year = padL(value.getFullYear(), 4);
	
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const targetVal = event.target.value;
		console.log(targetVal);
		const [year, month, day] = targetVal.split("-");
		
		
		onChange(parseInt(year), parseInt(month), parseInt(day));
	}
	
	return <Input
		id={id}
		className={className}
		type={InputType.Date}
		label={label}
		value={`${year}-${month}-${day}`}
		placeholder={placeholder}
		hint={hint}
		required={required}
		onChange={handleChange}
		onClick={onClick}
	/>
}

const padL = (n: number, count: number) => `${n}`.padStart(count, "0");

export default DateInput;
