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
	
	onChange?: (date: Date) => void;
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
	const formattedValue = value.toISOString().split("T")[0];
	
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const prevValue = isoDateToArray(formattedValue);
		const currValue = isoDateToArray(event.target.value);
		
		// Calculate the difference.
		const diffs = getDateArrayDir(prevValue, currValue);
		const oldDate = new Date(value);
		
		// Update the proper part.
		oldDate.setFullYear(oldDate.getFullYear() + diffs[0]);
		oldDate.setMonth(oldDate.getMonth() + diffs[1]);
		oldDate.setDate(oldDate.getDate() + diffs[2]);
		
		onChange(oldDate);
	}
	
	return <Input
		id={id}
		className={className}
		type={InputType.Date}
		label={label}
		value={formattedValue}
		placeholder={placeholder}
		hint={hint}
		required={required}
		onChange={handleChange}
		onClick={onClick}
	/>;
}

const isoDateToArray = (isoDate: string): number[] => isoDate.split("-").map(value => parseInt(value));

const getDateArrayDir = (prev: number[], curr: number[]) => {
	const diffs = new Array<number>();
	for (let i = 0; i < 3; i++) {
		if (curr[i] && prev[i]) {
			diffs.push(curr[i] - prev[i]);
		} else {
			diffs.push(0);
		}
	}
	return diffs;
}

export default DateInput;
