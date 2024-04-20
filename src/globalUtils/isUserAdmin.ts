const ADMIN_USER_IDS = process.env.ADMIN_USER_IDS;

interface props {
	userId: string;
}

const isUserAdmin = (props: props) => {
	const { userId } = props;

	const adminUserIDsArray: Array<String> = ADMIN_USER_IDS!.split(' ');

	if (adminUserIDsArray.indexOf(userId) !== -1) {
		return true;
	} else {
		return false;
	}
};

export default isUserAdmin;
