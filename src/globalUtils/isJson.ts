export const isJson = (str: string | any) => {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
};
