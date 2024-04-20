import fs from 'fs';

interface logFile {
	error: any;
	file: string;
	folder: string;
}

const logFile = (props: logFile) => {
	const { error, file, folder } = props;

	try {
		fs.appendFile(
			'logs/err_logs.txt',
			`${new Date().toUTCString()} : Something went wrong in ${folder}/${file}.ts \n Actual error: ${error} \n \n`,
			(err) => {
				if (err) throw err;
			},
		);

		return false;
	} catch (err) {
		console.log('Error logging failed');
	}
};

export default logFile;
