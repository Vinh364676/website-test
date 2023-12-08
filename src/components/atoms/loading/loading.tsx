import React, { useState, useEffect } from "react"
import "./loading.scss"
import { BehaviorSubject } from "rxjs"

// handle loading
const loadingSubject = new BehaviorSubject<boolean>(false)

export const toggleLoading = (value: boolean) => {
	loadingSubject.next(value)
}

const Loading = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [count, setCount] = useState(0)

	const toggleLoading = (value: boolean) => {
		if (value) {
			setCount((previous) => previous + 1)
		} else {
			setCount((previous) => (previous > 0 ? previous - 1 : 0))
		}
	}

	useEffect(() => {
		setIsLoading(count > 0)
	}, [count])

	//#region Subscribe Loading
	useEffect(() => {
		const subscribe = loadingSubject.subscribe((value) => {
			toggleLoading(value)
		})
		return () => {
			subscribe.unsubscribe()
		}
	}, [])
	//#endregion Subscribe Loading

	return isLoading ? (
		<div className="loading-section">
			<div className="overlay-background"></div>
			<div className="loader"></div>
		</div>
	) : null
}

export default Loading
