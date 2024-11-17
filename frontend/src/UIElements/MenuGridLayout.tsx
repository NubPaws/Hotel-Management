import "./MenuGridLayout.css";

const MenuGridLayout: React.FC<{children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="menu-grid-layout-container">
			{children}
		</div>
	);
}

export default MenuGridLayout;
