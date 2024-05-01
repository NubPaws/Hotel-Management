import './CenteredLabel.css'

export function CenteredLabel(props : {labelName: string}) {
    return (
        <div className="label">
            <div className="text-wrapper">{props.labelName}</div>
        </div>
    )
}