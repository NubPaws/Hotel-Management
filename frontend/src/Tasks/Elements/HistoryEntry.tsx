import { FC } from "react";

import "./HistoryEntry.css"

type HistoryEntryProps = {
	event: string;
};

const HistoryEntry: FC<HistoryEntryProps> = ({
	event
}) => {
    return <>
        <div>{event}</div>
    </>
}

export default HistoryEntry;