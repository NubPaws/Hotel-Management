import { FC } from "react";

import "./Dropdown.css";

type DropdownProps = {
	options: string[];
	onChange: (selectedOption: string) => void;
	emptyText?: string;
	defaultOption?: string;
	label?: string;
}

const Dropdown: FC<DropdownProps> = ({
	options,
	onChange,
	emptyText = "",
	defaultOption = "",
	label,
}) => {
	return (
		<div className="dropdown-wrapper">
			{label && (
				<label className="dropdown-label">{label}</label>
			)}
			<select
				defaultValue={defaultOption}
				onChange={(e) => onChange(e.target.value)}
				className="dropdown"
			>
				<option value="" disabled selected>
					{emptyText}
				</option>
				{options.map((option, index) => (
					<option key={index} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	);
};

export default Dropdown
