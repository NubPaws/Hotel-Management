import './CenteredLabel.css'

export interface CenteredLabelProp {
    labelName: string;
}

export function CenteredLabel(props: CenteredLabelProp) {
    return (
        <div className="centeredLabel">
            <u>{props.labelName}</u>
        </div>
    )
}