import React from "react";
import "./MenuGridLayout.css";

interface MenuGridLayoutProps {
	shadow?: boolean;
	width?: string;
	children: React.ReactNode;
}

const MenuGridLayout: React.FC<MenuGridLayoutProps> = ({
	children,
	shadow = false,
	width = "fit-content",
}) => {
	const shadowClass = shadow ? "menu-grid-box-shadow" : "";
	
	return (
		<div
			className={`menu-grid-layout-container ${shadowClass}`}
			style={{
				width: width,
			}}
		>
			{children}
		</div>
	);
};

export default MenuGridLayout;
