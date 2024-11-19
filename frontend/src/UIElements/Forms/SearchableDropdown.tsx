import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import { InputType } from "./Input";

import "./SearchableDropdown.css";

interface SearchableDropdownProps {
	id: string
	label?: string;
	placeholder?: string;
	required?: boolean;
	
	options: string[];
	
	setValue?: (value: string) => void
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
	id,
	label,
	placeholder = "Search...",
	required = false,
	
	options,
	
	setValue = () => {},
}) => {
	const elemId = `searchable-dropdown-${id}`;
	
	const [query, setQuery] = useState("");
	const [filteredOptions, setFilteredOptions] = useState(options);
	const [isOpen, setIsOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);
	
	const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setQuery(value);
		setValue(value);
		
		const filtered = options.filter((option) => (
			option.toLowerCase().includes(value.toLowerCase())
		));
		setFilteredOptions(filtered);
		
		setIsOpen(true);
	}
	
	const handleOptionClick = (option: string) => {
		setQuery(option);
		setValue(option);
		setIsOpen(false);
	}
	
	const handleOnBlur = () => {
		setIsOpen(false);
		setActiveIndex(0);
	}
	
	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (!isOpen || filteredOptions.length === 0) {
			return;
		}
		
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			
			const dir = event.key === "ArrowDown" ? +1 : -1;
			const len = filteredOptions.length;
			
			setActiveIndex((prevIndex) => (len + prevIndex + dir) % len);
		} else if (event.key === "Enter" && activeIndex !== -1) {
			event.preventDefault();
			handleOptionClick(filteredOptions[activeIndex]);
		}
	}
	
	return (
		<div className="dropdown-container">
			{label && (
				<label htmlFor={elemId} className="searchable-dropdown-label">
					{label}
				</label>
			)}
			<input
				id={elemId}
				className="dropdown-input"
				type={InputType.Text}
				value={query}
				onChange={handleOnChange}
				onClick={() => setIsOpen(true)}
				onBlur={handleOnBlur}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				required={required}
			/>
			{isOpen && filteredOptions.length > 0 && (
				<ul className="dropdown-list">
					{filteredOptions.map((option, index) => (
						<li
							key={index}
							className={`dropdown-item ${ index === activeIndex ? "active" : "" }`}
							onMouseDown={() => handleOptionClick(option)}
							onMouseOver={() => setActiveIndex(index)}
						>
							{option}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default SearchableDropdown;
