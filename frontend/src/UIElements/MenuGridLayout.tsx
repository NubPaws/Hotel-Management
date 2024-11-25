import React, { CSSProperties } from "react";
import "./MenuGridLayout.css";

interface MenuGridLayoutProps {
	shadow?: boolean;
	width?: string;
	columns?: string;
	children: React.ReactNode;
}

const MenuGridLayout: React.FC<MenuGridLayoutProps> = ({
	children,
	shadow = false,
	width = "fit-content",
	columns = "1fr 1fr",
}) => {
	const shadowClass = shadow ? "menu-grid-box-shadow" : "";
	
	const otherStyle: CSSProperties = {
		width: width,
		gridTemplateColumns: columns,
	};
	
	return (
		<div
			className={`menu-grid-layout-container ${shadowClass}`}
			style={otherStyle}
		>
			{children}
		</div>
	);
};

export default MenuGridLayout;
