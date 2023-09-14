import Button from "../Button";

export default function Pagination ({
    disabledPrev = false,
    disabledNext = false,
    currentPage = "",
    onChangePagination = (type = "next") => {},
}) {
    return (
        <div className="flex flex-row">
            <Button 
                disabled={disabledPrev} onClick={() => onChangePagination("prev")} 
                className={`${disabledPrev ? "hidden" : ""}`}
            >
                <svg class="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
                </svg>
            </Button>
            {currentPage}
            <Button 
                disabled={disabledNext} onClick={() => onChangePagination("next")}
                className={`${disabledNext ? "hidden" : ""}`}
            >
                <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </Button>
        </div>
    )
}