import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HiOutlineTrash,HiMagnifyingGlass,HiOutlinePencilSquare,HiXMark } from "react-icons/hi2"
import Input from "../../../components/Input/index.js"
import {PostAnswer, getUnanswered,resetSuccessForum,deleteQuestion} from "../../../store/slices/forum/slices.js"
import {formatDate} from "../../../utils/formatDate.js" 
import Button from "../../../components/Button/index.js"
import Pagination from "../../../components/PaginationV2"
import Modal from "../../../components/Modal/index.js"
import Message from "../../../components/Message/index.js"
import { AnswerValidationSchema} from "../../../store/slices/forum/validation.js"
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
    
    const [inputAnswer,setInputAnswer] = useState("")

    const questionRef = useRef()

    const [sortDate,setSortDate] = useState(false)

    const [showModal, setShowModal] = useState({ show: false, context: "" })
  
    const [page,setPage] = useState(1)

    const [selectedQuestion, setSelectedQuestion] = useState([])

    const [confirmation, setConfirmation] = useState(false);

    const handleShowModal = ({context,}) => {
        setShowModal({ show: true, context })
    }

    const handleCloseModal = () => {
        setShowModal({ show: false, context: "" })
        setSelectedQuestion([])
        dispatch(resetSuccessForum())
        document.body.style.overflow = "auto"
    }


    const onButtonFilter = () => {
        dispatch(getUnanswered({sortDate : (sortDate ? "DESC" : "ASC")}))
    }

    const clearFilter = () => {
        questionRef.current.value = ""
        const sort = sortDate ? "DESC" : "ASC"
        dispatch(getUnanswered({ sortDate : sort}))
    }

    const [error, setError] = useState("")
    const [isToastVisible, setIsToastVisible] = useState(false)

    const onSearch = async (e,question) =>{
        e.preventDefault()
        const sort = sortDate ? "DESC" : "ASC"
        dispatch(getUnanswered({filterQuestion : question, sortDate : sort}))
    }

    const handleOnSure = async (qnaId) => {
        try {
            const sort = sortDate ? "DESC" : "ASC"
            const output = 
            {answer : inputAnswer, qnaId : qnaId, sortDate : sort}
            
            await AnswerValidationSchema.validate({answer : inputAnswer},{
                abortEarly:false
            })
            
            // console.log(output)
            dispatch(PostAnswer(output)).then(()=>
            dispatch(getUnanswered(({sortDate : (sortDate ? "DESC" : "ASC")}))))
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

    const onChangeValue = (event, state) =>{
        const newValue = event.target.value
        if(newValue){
          state(newValue)
        }
      } 

useEffect( ()=>{
    dispatch(getUnanswered(({sortDate : (sortDate ? "DESC" : "ASC")})))
   
},[])

    useEffect(() => {
        dispatch(getUnanswered(({sortDate : (sortDate ? "DESC" : "ASC")})))

    }, [sortDate])
    
    return (
        <div>
            <div className="container py-24 lg:ml-[calc(5rem)] lg:px-8">
                <h3 className="title w-full border-b-2 mb-5 pb-2">
                    Daftar Pertanyaan
                </h3>
                <div className="my-5 items-center h-auto gap-3 flex flex-row justify-between w-full">
                    <div className="relative w-1/2 lg:w-1/3">
                    <form onSubmit={(event)=>{onSearch(event,questionRef.current.value)}}>
                    <Input type="text" placeholder="Cari pertanyaan..." 
                        ref={questionRef}
                        /> 
                    <div className="hidden sm:inline w-1/2 lg:w-1/3">  
                        {questionRef?.current?.value !== "" &&
                    <Button 
                        className="absolute top-1/2 right-10 -translate-y-1/2 p-2" 
                        type="button"
                        onClick={clearFilter}
                        >
                        <HiXMark className="text-2xl text-primary" />
                    </Button>          
                        }
                        
                    <Button 
                        className="absolute top-1/2 right-2 -translate-y-1/2 p-2" 
                        type="submit"
                            >
                        <HiMagnifyingGlass className="text-2xl text-primary" />
                    </Button>
                    </div>
                    </form>
                    </div>

                <div className="flex gap-2 items-center">
                  <span className="text-xs sm:text-sm font-semibold">Urutkan Tanggal Dari : </span>
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
                    <table className="text-gray-500 w-full text-left sm:text-sm text-xs border shadow-md">
                        <thead className="text-gray-700 bg-slate-100 sm:text-sm text-xs uppercase">
                            <tr>
                                <th className="p-3">Tanggal</th>
                                <th className="p-3">Pengguna</th>
                                <th className="p-3">Pertanyaan</th>
                                <th className="p-3">Jawaban</th>
                                <th className="p-3">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questionList?.map((list) => {
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
                                      
                                        <td className="p-3 gap-2 flex flex-col items-center justify center md:flex-row">
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
                                                    setInputAnswer("")
                                                }}
                                                className="bg-primary"
                                            >
                                                <HiOutlinePencilSquare className="text-lg" />
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
                                        
                                        <td className="p-3 gap-2 flex flex-col items-center justify-center md:flex-row">
                                            <Button isSmall isDisabled
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
                                                    setInputAnswer(list.answer)
                                                }}
                                                className=" bg-primary"
                                            >
                                                <HiOutlinePencilSquare className="text-lg" />
                                            </Button>
                                            
                                        </td>
                                    </tr>
                                )}
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="w-full flex items-center justify-center pt-8">
                     <Pagination currentPage={currentPage} totalPage={totalPage} setPage={setPage}/>
                </div>
            </div>
            <Modal halfWidth
                showModal={showModal.show}
                closeModal={handleCloseModal}
                title={showModal.context}
            >
                {(showModal.context === "Menjawab Pertanyaan" && !success) && (
                    <div className="flex max-h-[75vh] flex-col overflow-auto px-2">
                        <h3 className="mt-2 text-sm font-bold text-gray-600">Pertanyaan : </h3>
                        {selectedQuestion.question}
                        <h3 className="mt-2 text-sm font-bold text-gray-600">Masukan Jawaban Anda : </h3>
                        <Input value={inputAnswer} type="textarea" 
                            errorInput={error.answer }
                            onChange={(event) => {setError({ ...error, answer: false })
                            onChangeValue(event,setInputAnswer)
                        }}
                        />
                        {error.answer && (
                            <div className="text-sm text-red-500 dark:text-red-400">
                                {error.answer}
                            </div>
                        )}
                        <div className={`${confirmation ? "hidden" : "mt-4 flex gap-2"}`}>
                            <Button title="Kembali" isButton isSecondary 
                                onClick={() =>{
                                    handleCloseModal()
                                    setError({ ...error, answer: false })
                                }}
                            />
                            <Button isButton isPrimary title="Jawab"
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
                                <Button title="Tidak" isButton isSecondary onClick={handleCloseModal} />
                            )}
                            <Button title="Iya" isButton isDanger 
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
                            <Button title="Kembali"  isButton  isSecondary 
                                onClick={() => setConfirmation(false)}
                            />
                            <Button title="Ya" isButton isPrimary isDisabled={isToastVisible}
                                onClick={()=>{handleOnSure(selectedQuestion.qnaId)}}
                            >
                                Ya
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