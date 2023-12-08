import React, { useEffect } from "react"
import "./notification.scss"
import { BehaviorSubject } from "rxjs"
import { ResponseMessage } from "../../../@types/response-message"


const handleMessageSubject = new BehaviorSubject<ResponseMessage | null>(null);

export const showMessage = (value: ResponseMessage) => {
	handleMessageSubject.next(value)
}

const Notification = () => {

	useEffect(() => {
		const subscribe = handleMessageSubject.subscribe((msg) => {
			if (msg) {

			}
		})
		return () => {
			subscribe.unsubscribe()
		}
	}, [])

	return (
		<>
		</>
	)
}

export default Notification
