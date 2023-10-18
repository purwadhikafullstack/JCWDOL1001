import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HiMagnifyingGlass } from "react-icons/hi2"
import Input from "../../../components/Input/index.js"
import { PostQuestion, getForum } from "../../../store/slices/forum/slices"
import Button from "../../../components/Button"
import { FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa"
import { PostQuestionValidationSchema } from "../../../store/slices/forum/validation.js"
import { toast } from "react-toastify"
import QuestionsTable from "./component.questions.js"
import ModalCondition from "./component.modal.js"

function ForumPage () {
    const dispatch = useDispatch()

    const { questionList, totalPage, currentPage,isLoading, success, profile} = useSelector ((state) => {
        return {
            questionList : state?.forum?.list,
            totalPage : state?.forum?.totalPage,
            currentPage : state?.forum?.currentPage,
            isLoading : state?.forum?.isLoading,
            success : state?.forum?.success,
            profile : state?.auth?.profile
        }
    })
    
    const inputQuestionRef = useRef()

    const questionRef = useRef()

    const [showModal, setShowModal] = useState({ show: false, context: "" })
  
    const [selectedQuestion, setSelectedQuestion] = useState([])

    const [confirmation, setConfirmation] = useState(false);

    const [filter,setFilter] = useState(false)

    const [sortingDate,setSortingDate] = useState("DESC")

    const onButtonSortDate = (type="")=>{
        setSortingDate(type)
        setFilter(true)
    }

    const handleShowModal = ({context,}) => {
        setShowModal({ show: true, context })
        window.scrollTo({
            top: 0,
          });
    }

    const handleCloseModal = () => {
        setShowModal({ show: false, context: "" })
        setSelectedQuestion([])
        dispatch(getForum({sortDate :""}))
        document.body.style.overflow = "auto"
    }

    const onButtonFilter = () => {
        dispatch(getForum({sortDate : sortingDate,filterQuestion : questionRef?.current.value}))
        setFilter(true)
    }

    const clearFilter = () => {
        setSortingDate("DESC")
        dispatch(getForum({sortDate :""}))
        questionRef.current.value = ""
        setFilter(false)
    }

    const [error, setError] = useState("")
    const [isToastVisible, setIsToastVisible] = useState(false)
    const output = {}

    const handleOnSure = async () => {
        try {
            Object.assign(output,{question : inputQuestionRef.current.value})
            
            await PostQuestionValidationSchema.validate(output,{
                abortEarly:false
            })

            dispatch(PostQuestion(output))
            setConfirmation(false)

        }catch(error) {
            const errors = {}
            
            error.inner.forEach((innerError) => {
                errors[innerError.path] = innerError.message;
            })
            
            setError(errors)
            
            toast.error("Periksa kolom pengisian!")

            setIsToastVisible(true)

            setTimeout(() => {
                setIsToastVisible(false)
            }, 2000)
        }
    }

    const [page, setPage] = useState(1);

    const width = window.screen.width
    const mobileWidth = 414
    
    useEffect(() => {
        dispatch( getForum({page : page }) )
    }, [page])

    useEffect(() => {
        dispatch(getForum({sortDate :"DESC"}))
    }, [])

    return (
        <div>
            <div className="pb-10">
                <h3 className="title mb-4">
                    Daftar Pertanyaan
                </h3>
                <Button isSmall isPrimaryOutline isPrimary title="Ingin Bertanya"
                    onClick={() =>{
                        handleShowModal({context : "Memberikan Pertanyaan"})
                    }}
                />
                <div className={`relative flex ${width <= mobileWidth ? "flex-col w-[50%]" : "flex-row items-center mx-5"} my-5  h-auto gap-5`}>
                    <Input type="text" placeholder="Cari Pertanyaan" 
                        ref={questionRef}
                    />
                    <Button 
                        className={`absolute ${width <= mobileWidth ? " top-5 left-36" : "top-1/2 left-40"} -translate-y-1/2 p-2`} 
                        onClick={()=>{
                            dispatch(getForum({filterQuestion : questionRef?.current.value}))
                            setFilter(true)}}
                    >
                        <HiMagnifyingGlass className="text-2xl text-primary" />
                    </Button>
                    Urutkan berdasarkan :
                    <div className={`flex ${width <= mobileWidth && "pl-2"} gap-2  items-center h-auto`}>
                        Tanggal 
                        <FaSortAlphaDown className={`${sortingDate === "DESC"   ? "hidden" : "text-2xl text-primary"}`} onClick={()=>{onButtonSortDate("DESC")}} />
                        <FaSortAlphaUp className={`${sortingDate === "ASC" || sortingDate === "" ? "hidden" : "text-2xl text-primary"}`} onClick={()=>{onButtonSortDate("ASC")}}/>
                    </div>
                    <Button isButton isPrimary isSecondary={sortingDate === ""} isDisabled={sortingDate === ""}
                        className={`flex ${width <= mobileWidth ? "w-fit" : "mx-5"} items-center`}
                        onClick={onButtonFilter}
                    >
                        Atur
                        <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </Button>
                    <button className={`flex flex-row items-center h-auto text-red-700 ${filter ? "" : "hidden"}`}
                        onClick={clearFilter} 
                    >
                        Hapus Pengaturan
                    </button>
                </div>
                <QuestionsTable selectedQuestion={selectedQuestion} showModal={showModal} handleCloseModal={handleCloseModal} handleShowModal={handleShowModal} setSelectedQuestion={setSelectedQuestion} questionList={questionList} currentPage={currentPage} totalPage={totalPage} setPage={setPage} />
            </div>
            <ModalCondition
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                profile={profile}
                setError={setError}
                inputQuestionRef={inputQuestionRef}
                error={error}
                confirmation={confirmation}
                setConfirmation={setConfirmation}
                selectedQuestion={selectedQuestion}
                isLoading={isLoading}
                success={success}
                handleOnSure={handleOnSure}
                isToastVisible={isToastVisible}
            />
        </div>
    )
}
export default ForumPage