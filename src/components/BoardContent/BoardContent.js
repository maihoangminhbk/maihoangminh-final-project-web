import React from "react";
import './BoardContent.scss';
import Column from "components/Column/Column";

function BoardContent() {
    return (
        <div className="board-content">
            <Column />
            <Column />
            <Column />
            <Column />
            <Column />
        </div>

    )
}

export default BoardContent;

