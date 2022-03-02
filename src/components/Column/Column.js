import React from "react";
import './Column.scss';
import Task from "components/Task/Task";

function Column() {
    return (

        <div className='columns'>
            <header>Brainstorm</header>
            <ul className="task-list">
                <Task />
                <li className="task-item">Add in here</li>
                <li className="task-item">Add in here</li>
                <li className="task-item">Add in here</li>
                <li className="task-item">Add in here</li>
                <li className="task-item">Add in here</li>
            </ul>
            <footer>Add another card</footer>
        </div>

    )
}

export default Column;