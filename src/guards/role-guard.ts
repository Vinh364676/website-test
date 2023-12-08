
import { CookieConstants } from "../constants/local"
import cookie from 'react-cookies';

export const hasPermission = (expectRoles: PERMISSION[]) => {
	if (!expectRoles || expectRoles.length === 0) return true

	const permissions = cookie.load(CookieConstants.PERMISSIONS)
	if (!permissions || permissions === null) return false
	const arrPermissions = permissions.split(";")
	if (!arrPermissions.length) return false
	else {
		const intersection = arrPermissions.filter(function (v: any) {
			// check element present in the second array
			return expectRoles.indexOf(v) > -1
		})

		return intersection.length !== 0
	}
}

export enum PERMISSION {
	EXAMPLE = "EXAMPLE",
}
