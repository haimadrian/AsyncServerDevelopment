import React, {useEffect, useState} from 'react';
import './Pagination.css';
import logo from "../../../../../components/logo";

export default function Pagination({movePages,data, RenderComponent, totalData, dataLimit }) {

    const [currentPage, setCurrentPage] = useState(1);
    let pages = parseInt(totalData / dataLimit);

    if (totalData % 10 != 0) {
        pages = pages + 1;
    }
    if (totalData === 0){
        pages = 1;
    }

    function goToNextPage() {
        setCurrentPage((page) => page + 1);
        movePages(currentPage);
    }

    function goToPreviousPage() {
        setCurrentPage((page) => page - 1);
        movePages(currentPage-2);
    }

    function changePage(event) {
        const pageNumber = Number(event.target.textContent);
        setCurrentPage(pageNumber);
        movePages(pageNumber-1);
    }

    const getPaginatedData = () => {
        return data;
    };

    const getPaginationGroup = () => {
        let start = 0;
        if (totalData != 0){
             start = Math.floor((currentPage - 1) / totalData) * totalData;
        }
        const arr = new Array(pages).fill().map((_, idx) => start + idx + 1)
        return arr;
    };

    return (
        <div>
            {/* show the posts, 10 posts at a time */}
            <div className="dataContainer">
                {<RenderComponent items={getPaginatedData()} />}
            </div>

            {/* show the pagiantion
        it consists of next and previous buttons
        along with page numbers, in our case, 5 page
        numbers at a time
    */}
            <div className="pagination">
                {/* previous button */}
                <button
                    onClick={goToPreviousPage}
                    className={`prev ${currentPage === 1 ? 'disabled' : ''}`}>
                    Prev
                </button>

                {/* show page numbers */}
                {getPaginationGroup().map((item, index) => (
                    <button
                        key={index}
                        onClick={changePage}
                        className={`paginationItem ${currentPage === item ? 'active' : null}`}>
                        <span>{item}</span>
                    </button>
                ))}

                {/* next button */}
                <button
                    onClick={goToNextPage}
                    className={`next ${currentPage === pages ? 'disabled' : ''}`}>
                    Next
                </button>
            </div>
        </div>
    );
}
