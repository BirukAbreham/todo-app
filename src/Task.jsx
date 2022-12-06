import React from "react"
import cross from "./images/icon-cross.svg"

function Task(props) {

    const { id, item, isCompleted } = props.task

    return (
        <li 
            className={`${props.theme === "light" ? "task--item" : "task--item dark"}`}
        >
            <input 
                id="check" 
                type="checkbox" 
                name="item-checked"
                checked={isCompleted}
                onChange={(event) => props.handleChecked(id)}
            />
            <label 
                htmlFor="item-checked"
                className={`${isCompleted ? "task--completed" : ""}`}
            >
                {item}
            </label>

            <div 
                className="task--delete"
                onClick={(event) => props.handleTaskDelete(id)}
            >
                <img src={cross} alt="cross" />
            </div>
        </li>
    )
}

export default Task
