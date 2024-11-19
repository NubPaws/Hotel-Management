import React from 'react'
import './CenteredLabel.css'

interface CenteredLabelProp {
    children: React.ReactNode;
    fontSize?: string;
}

const CenteredLabel: React.FC<CenteredLabelProp> = ({
    children,
    fontSize = "36pt"
}) => (
    <div className="centeredLabel" style={{ fontSize }}>
        <u>{children}</u>
    </div>
);

export default CenteredLabel;
