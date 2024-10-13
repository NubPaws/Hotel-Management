import './CenteredLabel.css'

export function CenteredLabel(props : {labelName: string}) {
    return (
        <div className="centeredLabel">
            <span className="centeredLabelText">{props.labelName}</span>
        </div>
    )
}