import React from 'react'
import './CenteredLabel.css'

export interface CenteredLabelProp {
    children: React.ReactNode;
}

export function CenteredLabel(props: CenteredLabelProp) {
    return (
        <div className="centeredLabel">
            <u>{props.children}</u>
        </div>
    )
}