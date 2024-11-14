import React from 'react'
import './CenteredLabel.css'

interface CenteredLabelProp {
    children: React.ReactNode;
}

const CenteredLabel: React.FC<CenteredLabelProp> = ({ children }) => (
    <div className="centeredLabel">
        <u>{children}</u>
    </div>
);

export default CenteredLabel;
