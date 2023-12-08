import axios, { AxiosInstance, AxiosResponse, ResponseType } from "axios"
import HttpStatus from "http-status-codes"
import qs from "qs"
import { ResponseMessage } from "../@types/response-message"
import { toggleLoading } from "../components/atoms/loading/loading"
import { showMessage } from "../components/atoms/notification/notification"
import { LOCAL_STORAGE_KEYS } from "../constants/local"
import API_URL, { ROUTE_PATHS } from "../constants/url-config"
import i18n from "../utils/i18n"
import LocalUtils from "../utils/local"

const axiosInstance = (
	handleErrorAutomatic: boolean,
	successMessage?: string,
	contentType: string = "application/json",
	responseType: ResponseType = "json",
	isShowLoading: boolean = true,
	isShowMessage: boolean = true
): AxiosInstance => {
	if (isShowLoading) toggleLoading(true)

	const instance = axios.create({
		baseURL: API_URL,
		headers: {
			"Content-Type": contentType,
			Authorization: `Bearer ${LocalUtils.get(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)}`,
		},
		responseType: responseType,
	})

	instance.interceptors.response.use(
		(response) => {
			if (isShowLoading) toggleLoading(false)

			const method = response.config.method;

			(method === "post" || method === "put" || method === "delete") && isShowMessage &&
				showMessage({
					message: successMessage ? successMessage : i18n.t("common.requestSuccessful"),
					type: "success",
				})
			return response
		},
		(error) => {
			if (isShowLoading) toggleLoading(false)
			let _error: ResponseMessage = {
				type: "error",
				message: "",
				code: "",
			}

			if (error.response) {
				let status = error.response.status
				// when UnAuthorize
				if (status === HttpStatus.UNAUTHORIZED || status === HttpStatus.FORBIDDEN) {
					handleUnAuthorize()
				}
			}

			if (error.message && error.message === "Network Error") {
				_error.message = "No internet connection"
				_error.code = "networkError"
			} else if (error.message && error.message === "Request failed with status code 500") {
				_error.message = "Request failed with status code 500"
				_error.code = HttpStatus.INTERNAL_SERVER_ERROR
			} else if (error.response && error.response.data && error.response.data.Message) {
				_error.code = error.response.data.status
				const message = error.response.data.Message // Get error message from translation file or default
				// when system return code Unauthorized
				if (_error.code === "Unauthorized") {
					handleUnAuthorize()
				}
				_error.message = message
			} else if (error.response && error.response.data && error.response.data.errors) {
				const errors: { [key: string]: string[] } = error.response.data.errors
				const serverError = Object.values(errors).reduce((prev, curr) => [...prev, ...curr])
				_error.code = error.response.data.status
				_error.message = serverError.join(" ")
			} else {
				_error.message = error + "" // cast to string type
			}
			// show error
			if (handleErrorAutomatic && _error.message !== "Error: Request failed with status code 401") {
				showMessage(_error)
			}

			return Promise.reject(error)
		}
	)
	return instance
}

export const getAsync = (
	url: string,
	params?: { [key: string]: any },
	isShowLoading: boolean = true,
	isShowMessage: boolean = true,
	handleErrorAutomatic: boolean = true
  ): Promise<AxiosResponse> => {
	return axiosInstance(
	  handleErrorAutomatic,
	  undefined,
	  "application/json",
	  "json",
	  isShowLoading,
	  isShowMessage
	).get(url, {
	  params: params,
	  paramsSerializer: function (params) {
		return qs.stringify(params, { arrayFormat: "repeat" });
	  },
	});
  };

export const postAsync = (
	url: string,
	json?: object,
	successMessage?: string,
	isShowLoading: boolean = true,
	isShowMessage: boolean = true,
	handleErrorAutomatic: boolean = true
): Promise<AxiosResponse> => {
	return axiosInstance(
		handleErrorAutomatic,
		successMessage,
		"application/json",
		"json",
		isShowLoading,
		isShowMessage
	).post(url, json)
}

export const putAsync = (
	url: string,
	json?: object,
	successMessage?: string,
	isShowLoading: boolean = true,
	isShowMessage: boolean = true,
	handleErrorAutomatic: boolean = true
): Promise<AxiosResponse> => {
	return axiosInstance(
		handleErrorAutomatic,
		successMessage,
		"application/json",
		"json",
		isShowLoading,
		isShowMessage
	).put(url, json)
}

export const deleteAsync = (
	url: string,
	successMessage?: string,
	isShowLoading: boolean = true,
	isShowMessage: boolean = true,
	handleErrorAutomatic: boolean = true
): Promise<AxiosResponse> => {
	return axiosInstance(
		handleErrorAutomatic,
		successMessage,
		"application/json",
		"json",
		isShowLoading,
		isShowMessage
	).delete(url)
}

function handleUnAuthorize() {
	LocalUtils.clear();
	window.location.replace(ROUTE_PATHS.SignIn);
}
