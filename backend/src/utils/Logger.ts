import fs from 'fs';

const INFO_FROM  = "info";
const ERROR_FROM = "error";
const WARN_FROM  = "warning";

let fileOut = "";

function setOutputFile(filename: string) {
	fileOut = filename;
}

function display(text: string, from: string) {
	const toDisplay = `[${from}]: ${text}`;
	
	console.log(toDisplay);
	if (fileOut !== "") {
		fs.appendFile(fileOut, toDisplay, (err) => {
			setOutputFile("");
			display("Failed to write to log file, clearing output file.", ERROR_FROM);
		});
	}
}

export default {
	info: (text: string) => display(text, INFO_FROM),
	error: (text: string) => display(text, ERROR_FROM),
	warn: (text: string) => display(text, WARN_FROM),
	
	log: (source: string, text: string) => display(text, source),
	
	setLogFile: setOutputFile,
}
