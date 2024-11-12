import fs from "fs/promises";

const INFO_FROM  = "info";
const ERROR_FROM = "error";
const WARN_FROM  = "warning";

let fileOut = "";

function setOutputFile(filename: string) {
	fileOut = filename;
}

function clearOutputFile() {
	setOutputFile("");
}

function display(from: string, ...args: any[]) {
	
	console.log(from, ...args);
	if (fileOut !== "") {
		fs.appendFile(fileOut, `[${from}]: ${args.join(" ")}`)
			.catch((reason: any) => {
				clearOutputFile();
				display(ERROR_FROM, "failed to write to log file, clearing output file.", reason);
			});
	}
}

export default {
	info: (text: string) => display(INFO_FROM, text),
	error: (text: string) => display(ERROR_FROM, text),
	warn: (text: string) => display(WARN_FROM, text),
	
	log: (source: string, text: string) => display(source, text),
	
	setLogFile: setOutputFile,
	clearOutputFile,
}
