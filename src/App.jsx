import React, { useState, useEffect } from "react"
import { nanoid } from "nanoid"
import Task from "./Task"
import moon from "./images/icon-moon.svg"
import sun from "./images/icon-sun.svg"
import bgDeskLight from "./images/bg-desktop-light.jpg"
import bgDeskDark from "./images/bg-desktop-dark.jpg"
import bgMobileLight from "./images/bg-mobile-light.jpg"
import bgMobileDark from "./images/bg-mobile-dark.jpg"


function App() {
	const [newTask, setNewTask] = useState("")
	const [tasks, setTasks] = useState([])
	const [itemFilter, setItemFilter] = useState("all")
	const [themeSetting, setThemeSetting] = useState({
		theme: "light",
		bgImage: bgDeskLight,
		windowWidth: window.innerWidth
	})

	function handleThemeChange() {
		setThemeSetting((prevSetting) => {
			let img
			let theme = prevSetting.theme === "light" ? "dark" : "light"

			if (window.innerWidth > 1278 && theme === "light") {
				img = bgDeskLight
			} else if (window.innerWidth > 1278 && theme === "dark") {
				img = bgDeskDark
			} else if (window.innerWidth <= 1278 && theme === "light") {
				img = bgMobileLight
			} else if (window.innerWidth <= 1278 && theme === "dark") {
				img = bgMobileDark
			}

			return {...prevSetting, theme: theme, bgImage: img }
		})
	}

	useEffect(() => {
		function  windowResizeHandler() {
			setThemeSetting((prevSetting) => {
				let img 
				let { theme } = prevSetting
				let newWidth = window.innerWidth
				
				if (newWidth > 1278 && theme === "light") {
					img = bgDeskLight
				} else if (newWidth > 1278 && theme === "dark") {
					img = bgDeskDark
				} else if (newWidth <= 1278 && theme === "light") {
					img = bgMobileLight
				} else if (newWidth <= 1278 && theme === "dark") {
					img = bgMobileDark
				}

				return { ...prevSetting, bgImage: img, windowWidth: newWidth }
			})
		}
		
		window.addEventListener("resize", windowResizeHandler)

		return window.removeEventListener("resize", windowResizeHandler)
	}, [themeSetting])

	function handleNewTask(event) {
		event.preventDefault()

		setNewTask(event.target.value)
	}

	function addToTask(event) {
		if (event.key === "Enter") {
			event.preventDefault()

			setTasks((prevTasks) => {
				return [
					{
						id: nanoid(),
						item: newTask,
						isCompleted: false,
					},
					...prevTasks
				]
			})

			setNewTask("")
		}
	}

	function listNotCompletedTasks() {
		return tasks.reduce((taskNotComplete, currentTask) => {
			if (!currentTask.isCompleted) taskNotComplete += 1
			return taskNotComplete
		}, 0)
	}

	function handleItemFilter(event, value) {
		event.preventDefault()
		setItemFilter(value)
	}

	function handleTaskCheck(id) {
		setTasks((prevTasks) => {
			return prevTasks.map((task) => {
				if (task.id === id) {
					return {
						...task,
						isCompleted: !task.isCompleted
					}
				} 

				return task
			})
		})
	}

	function handleClearCompleted(event) {
		event.preventDefault()
		setTasks((prevTasks) => {
			return prevTasks.filter((task) => task.isCompleted === false)
		})
	}

	function handleTaskDelete(id) {
		setTasks((prevTasks) => {
			return prevTasks.filter((task) => task.id !== id)
		})
	}

	let taskFiltered = tasks.filter((task) => {
		if (itemFilter === "active") {
			return task.isCompleted === false
		} else if (itemFilter === "completed") {
			return task.isCompleted === true
		} 

		return true
	})

	const taskElements = taskFiltered.map((task) => {
		return (
			<Task 
				key={task.id}
				task={task}
				theme={themeSetting.theme}
				handleChecked={handleTaskCheck}
				handleTaskDelete={handleTaskDelete}
			/>
		)
	})

	return (
		<div 
			className="app"
			style={{
				backgroundImage: `url(${themeSetting.bgImage})`,
				backgroundColor: themeSetting.theme === "light" ? `hsl(0, 0%, 98%)` : `hsl(235, 21%, 11%)`
			}}
		>
			<div className="container">
				<section className="app--header">
					<h2 className="app--title">
						TODO
					</h2>
					<div 
						className="app--mode"
						onClick={handleThemeChange}
						style={{ background: themeSetting.theme === "light" ? `url(${moon})` : `url(${sun})` }}
					>
					</div>
				</section>
				<section className={`${themeSetting.theme === "light" ? "app--add" : "app--add  dark"}`}>
					<input 
						type="text" 
						value={newTask}
						name="newTask"
						onChange={(event) => handleNewTask(event)}
						onKeyDown={(event) => addToTask(event)}
						placeholder="Create a new todo..."
					/>
				</section>
				{ 
					tasks.length > 0 && 
					<section className={`${themeSetting.theme === "light" ? "tasks" : "tasks dark"}`}>
						<ul>{taskElements}</ul>
						<div className="task--actions">
							<div className="items--left">
								{listNotCompletedTasks()} items left
							</div>
							<div className="item--filter">
								<div 
									className="item"
									onClick={(event) => handleItemFilter(event, "all")}
									style={{ 
										color: `${itemFilter === "all" ? "hsl(220, 98%, 61%)" : "hsl(236, 9%, 61%)" }`
									}}
								>
									All
								</div>
								<div 
									className="item"
									onClick={(event) => handleItemFilter(event, "active")}
									style={{ 
										color: `${itemFilter === "active" ? "hsl(220, 98%, 61%)" : "hsl(236, 9%, 61%)" }`
									}}
								>
									Active
								</div>
								<div 
									className="item"
									onClick={(event) => handleItemFilter(event, "completed")}
									style={{ 
										color: `${itemFilter === "completed" ? "hsl(220, 98%, 61%)" : "hsl(236, 9%, 61%)" }`
									}}
								>
									Completed
								</div>
							</div>
							<div 
								className="clear--completed"
								onClick={(event) => handleClearCompleted(event)}
							>
								Clear Completed
							</div>
						</div>
					</section>
				}
				{
					tasks.length > 0 &&
					<div className={`${themeSetting.theme === "light" ? "item-mobile--filter" : "item-mobile--filter dark"}`}>
						<div 
							className="item"
							onClick={(event) => handleItemFilter(event, "all")}
							style={{ 
								color: `${itemFilter === "all" ? "hsl(220, 98%, 61%)" : "hsl(236, 9%, 61%)" }`
							}}
						>
							All
						</div>
						<div 
							className="item"
							onClick={(event) => handleItemFilter(event, "active")}
							style={{ 
								color: `${itemFilter === "active" ? "hsl(220, 98%, 61%)" : "hsl(236, 9%, 61%)" }`
							}}
						>
							Active
						</div>
						<div 
							className="item"
							onClick={(event) => handleItemFilter(event, "completed")}
							style={{ 
								color: `${itemFilter === "completed" ? "hsl(220, 98%, 61%)" : "hsl(236, 9%, 61%)" }`
							}}
						>
							Completed
						</div>
					</div>
				}
			</div>
		</div>
	)
}

export default App
