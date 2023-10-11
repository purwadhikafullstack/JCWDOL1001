import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HiOutlineTrash,HiMagnifyingGlass } from "react-icons/hi2"
import { RiQuestionAnswerLine } from "react-icons/ri"
import Input from "../../../components/Input/index.js"
import {deleteQuestion, PostAnswer, getForum,getUnanswered } from "../../../store/slices/forum/slices.js"
import {formatDate} from "../../../utils/formatDate.js" 
import Button from "../../../components/Button/index.js"
import Pagination from "../../../components/PaginationV2"
import Modal from "../../../components/Modal/index.js"
import Message from "../../../components/Message/index.js"
import { FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa"
import { AnswerValidationSchema, PostQuestionValidationSchema } from "../../../store/slices/forum/validation.js"
import { toast } from "react-toastify"

function QNA () {
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
    
    const inputAnswerRef = useRef()
    const [unansweredList, setUnansweredList] = useState([])
    const [answeredList, setAnsweredList] = useState([])

    const answerRef = useRef()

    const [sortDate,setSortDate] = useState(false)

    const [showModal, setShowModal] = useState({ show: false, context: "" })
  
    const [selectedQuestion, setSelectedQuestion] = useState([])

    const [confirmation, setConfirmation] = useState(false);

    const [filter,setFilter] = useState(false)

    const [sortingDate,setSortingDate] = useState("")

    const onButtonSortDate = (type="")=>{
        setSortingDate(type)
        setFilter(true)
    }

    const handleShowModal = ({context,}) => {
        setShowModal({ show: true, context })
    }

    const handleCloseModal = () => {
        setShowModal({ show: false, context: "" })
        setSelectedQuestion([])
        dispatch(getForum({sortDate :""}))
        document.body.style.overflow = "auto"
    }

    
    const onChangePagination = (type) => {
        dispatch(
            getForum({ 
                page : type === "prev" ? Number(currentPage) - 1 : Number(currentPage) + 1, 
            })
        )
    }

    const onButtonFilter = () => {
        // dispatch(getUnanswered({sortDate : (sortDate ? "DESC" : "ASC")}))
        setFilter(true)
    }

    const clearFilter = () => {
        setSortingDate("")
        dispatch(getForum({sortDate :""}))
        answerRef.current.value = ""
        setFilter(false)
    }

    const [error, setError] = useState("")
    const [isToastVisible, setIsToastVisible] = useState(false)
    const output = {}

    const handleOnSure = async (qnaId) => {
        try {
            Object.assign(output,{answer : inputAnswerRef.current.value, qnaId : qnaId })
            
            await AnswerValidationSchema.validate({answer : inputAnswerRef.current.value},{
                abortEarly:false
            })

            dispatch(PostAnswer(output))
            setConfirmation(false)

        }catch(error) {
            const errors = {}
            
            error.inner.forEach((innerError) => {
                errors[innerError.path] = innerError.message;
            })
            
            setError(errors)
            
            toast.error("Check your input field!")

            setIsToastVisible(true)

            setTimeout(() => {
                setIsToastVisible(false)
            }, 2000)
        }
    }
useEffect(async ()=>{
    dispatch(getUnanswered(({sortDate : (sortDate ? "DESC" : "ASC")})))

        setUnansweredList([])
        setAnsweredList([])
        const answerlist = []
        const unanswerlist = []
        questionList.map(item=>{
            if(item.answer){
                answerlist.push(item)
            }
            else{
                unanswerlist.push(item)
            }
        })
        setAnsweredList(answerlist)
        setUnansweredList(unanswerlist)
    
},[])

    useEffect(() => {
        dispatch(getUnanswered(({sortDate : (sortDate ? "DESC" : "ASC")})))
        if(questionList){
            setUnansweredList([])
            setAnsweredList([])
            const answerlist = []
            const unanswerlist = []
            questionList.map(item=>{
                if(item.answer){
                    answerlist.push(item)
                }
                else{
                    unanswerlist.push(item)
                }
            })
            setAnsweredList(answerlist)
            setUnansweredList(unanswerlist)
        }
    }, [sortDate])


    return (
        <div>
            <div className="container py-24 lg:ml-[calc(5rem)] lg:px-8">
                <a className="flex items-center normal-case text-[20pt] pb-3">
                    Daftar Pertanyaan
                </a>
                <div className="relative mx-5 my-5 items-center h-auto gap-5 flex flex-row justify-between">
                    <Input type="text" placeholder="Search" 
                        ref={answerRef}
                    />
                    <Button 
                        className="absolute top-1/2 left-40 -translate-y-1/2 p-2" 
                        onClick={()=>{
                            dispatch(getForum({filterQuestion : answerRef?.current.value}))
                            setFilter(true)}}
                    >
                        <HiMagnifyingGlass className="text-2xl text-primary" />
                    </Button>

                <div className="flex gap-2 items-center">
                  <span className="text-sm font-semibold">Urutkan Tanggal Dari : </span>
                  <Button 
                    isButton
                    isPrimary
                    className={`relative`}
                    title={sortDate ? "Terbaru" : "Terlama"}
                    onClick={() => {
                        setSortDate(prevState => !prevState)
                        onButtonFilter()
                    }}
                    />
                </div>
                </div>
                <div>
                    <table className="text-gray-500 w-full text-left text-sm border shadow-md">
                        <thead className="text-gray-700 bg-slate-100 text-sm uppercase">
                            <tr>
                                <th className="p-3">Tanggal</th>
                                <th className="p-3">Pengguna</th>
                                <th className="p-3">Pertanyaan</th>
                                <th className="p-3">Jawaban</th>
                                <th className="p-3">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questionList.map((list) => {
                                if(!list.answer){
                                return (
                                    <tr className="items-center text-left border-b-2">
                                        <th className="p-3 ">{formatDate(list.createdAt)}</th>
                                        <td className="p-3 ">{list.user_profile.name}</td>
                                        <th className="p-3 break-all max-w-sm  text-primary">
                                        {list.question}</th>
                                        <th className="p-3 break-all max-w-sm text-red-600"> 
                                       ...jawaban diperlukan
                                        </th> 
                                      
                                        <td className="p-3 ">
                                            <Button isSmall isDanger
                                                onClick={() =>{
                                                    handleShowModal({context : "Hapus Pertanyaan"})
                                                    setSelectedQuestion(list)
                                                }}
                                            >
                                                <HiOutlineTrash className="text-lg" />
                                            </Button>
                                            
                                            
                                            <Button isSmall isPrimary
                                            // ={!list.answer} isDisabled={list.answer}
                                                onClick={() =>{
                                                    handleShowModal({context : "Menjawab Pertanyaan"})
                                                    setSelectedQuestion(list)
                                                }}
                                                className="ml-2 bg-primary"
                                            >
                                                <RiQuestionAnswerLine  className="text-lg" />
                                            </Button>
                                            
                                        </td>
                                    </tr>
                                )}
                            })}
                            {questionList.map((list) => {
                                if(list.answer){
                                return (
                                    <tr className="items-center text-left border-b-2">
                                        <th className="p-3 ">{formatDate(list.createdAt)}</th>
                                        <td className="p-3 ">{list.user_profile.name}</td>
                                        <th className="p-3 break-all max-w-sm  text-primary">
                                        {list.question}</th>
               
                                        <th className="p-3 break-all max-w-sm "> 
                                        {list.answer}
                                        </th> 
                                        
                                        <td className="p-3 ">
                                            <Button isSmall isDanger
                                                onClick={() =>{
                                                    handleShowModal({context : "Hapus Pertanyaan"})
                                                    setSelectedQuestion(list)
                                                }}
                                            >
                                                <HiOutlineTrash className="text-lg" />
                                            </Button>
                                            
                                            
                                            <Button isSmall isPrimary
                                            // ={!list.answer} isDisabled={list.answer}
                                                onClick={() =>{
                                                    handleShowModal({context : "Menjawab Pertanyaan"})
                                                    setSelectedQuestion(list)
                                                }}
                                                className="ml-2 bg-primary"
                                            >
                                                <RiQuestionAnswerLine  className="text-lg" />
                                            </Button>
                                            
                                        </td>
                                    </tr>
                                )}
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="w-full flex items-center justify-center pt-8">
                    <Pagination 
                        onChangePagination={onChangePagination}
                        disabledPrev={Number(currentPage) === 1}
                        disabledNext={currentPage >= totalPage}
                        currentPage={currentPage}
                    />
                </div>
            </div>
            <Modal halfWidth
                showModal={showModal.show}
                closeModal={handleCloseModal}
                title={showModal.context}
            >
                {(showModal.context === "Menjawab Pertanyaan" && !success) && (
                    <div className="flex max-h-[75vh] flex-col overflow-auto px-2">
                        <p className="mt-2">Masukan Jawaban Anda : </p>
                        <Input ref={inputAnswerRef} type="textarea" 
                            errorInput={error.answer }
                            onChange={() => setError({ ...error, answer: false })}
                        />
                        {error.answer && (
                            <div className="text-sm text-red-500 dark:text-red-400">
                                {error.answer}
                            </div>
                        )}
                        <div className={`${confirmation ? "hidden" : "mt-4 flex gap-2"}`}>
                            <Button title="Back" isButton isSecondary 
                                onClick={() =>{
                                    handleCloseModal()
                                    setError({ ...error, answer: false })
                                }}
                            />
                            <Button isButton isPrimary title="Confirm"
                                onClick={()=>{setConfirmation(true)}}
                            />
                        </div>
                    </div>
                )}
                {(showModal.context === "Hapus Pertanyaan" && !success) && (
                    <>
                        <p className="modal-text">
                            Anda yakin akan menghapus pertanyaan ini " {selectedQuestion.question} " ?
                        </p>
                        <div className="mt-4 flex justify-end gap-2">
                            {!isLoading && (
                                <Button title="No" isButton isSecondary onClick={handleCloseModal} />
                            )}
                            <Button title="Yes" isButton isDanger 
                                isLoading={isLoading}
                                onClick={() => dispatch(deleteQuestion(selectedQuestion.qnaId))}
                            />
                        </div>
                    </>
                )}
                {(confirmation && !success) && (
                    <div className="pt-10">
                        <p className="modal-text">
                            Apakah jawaban Anda sudah benar?
                        </p>
                        <div className="flex gap-2">
                            <Button title="Cancel"  isButton  isSecondary 
                                onClick={() => setConfirmation(false)}
                            />
                            <Button title="Sure" isButton isPrimary isDisabled={isToastVisible}
                                onClick={()=>{handleOnSure(selectedQuestion.qnaId)}}
                            >
                                Sure
                            </Button>
                        </div>
                    </div>
                )}
                {success && (
                    <Message
                        type="success"
                        message={
                            `Pertanyaan ${showModal.context === "Hapus Pertanyaan" 
                            ? `" ${selectedQuestion.question} " berhasil dihapus` 
                            : `" ${selectedQuestion?.question} " berhasil dijawab`}`}
                        handleCloseModal={() =>handleCloseModal()}
                    />
                )}
            </Modal>
        </div>
    )
}
export default QNA 