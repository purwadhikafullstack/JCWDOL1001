import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HiOutlineTrash,HiMagnifyingGlass } from "react-icons/hi2"
import Input from "../../../components/Input/index.js"
import { AnswerQuestion, deleteQuestion, getForum } from "../../../store/slices/forum/slices"
import {formatDate} from "../../../utils/formatDate.js" 
import Button from "../../../components/Button"
import Pagination from "../../../components/Pagination"
import Modal from "../../../components/Modal"
import SuccessMessage from "../../../components/Message"
import { FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa"

function ForumPage () {
    const dispatch = useDispatch()

    const { questionList, totalPage, currentPage,isLoading, success} = useSelector ((state) => {
        return {
            questionList : state?.forum?.list,
            totalPage : state?.forum?.totalPage,
            currentPage : state?.forum?.currentPage,
            isLoading : state?.forum?.isLoading,
            success : state?.forum?.success,
        }
    })
    
    const answerRef = useRef()

    const nameRef = useRef()

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
        dispatch(getForum())
        document.body.style.overflow = "auto"
    }

    const handleOnSure = () => {
        dispatch(AnswerQuestion({qnaId:selectedQuestion.qnaId, answer : {answer : answerRef.current.value}}))
    }

    const onChangePagination = (type) => {
        dispatch(
            getForum({ 
                page : type === "prev" ? Number(currentPage) - 1 : Number(currentPage) + 1, 
            })
        )
    }

    const onButtonFilter = () => {
        dispatch(getForum({sortDate : sortingDate,filterName : nameRef?.current.value}))
        setFilter(true)
    }

    const clearFilter = () => {
        setSortingDate("")
        dispatch(getForum({sortDate :""}))
        nameRef.current.value = ""
        setFilter(false)
    }

    useEffect(() => {
        dispatch(getForum({sortDate :""}))
    }, [])

    return (
        <div className="container py-24 lg:ml-[calc(5rem)] lg:px-8">
            <div className="pb-10">
                <a className="flex items-center normal-case text-[20pt] pb-3">
                    Daftar Pertanyaan
                </a>
                <div className="relative flex mx-5 my-5 items-center h-auto gap-5">
                    <Input 
                        type="text" 
                        placeholder="Search" 
                        className=""
                        ref={nameRef}
                    />
                    <Button 
                        className="absolute top-1/2 left-40 -translate-y-1/2 p-2" 
                        onClick={()=>{
                            dispatch(getForum({filterName : nameRef?.current.value}))
                            setFilter(true)}}
                    >
                        <HiMagnifyingGlass className="text-2xl text-primary" />
                    </Button>
                    Urutkan berdasarkan :
                    <div className="flex flex-row items-center h-auto">
                        Tanggal 
                        <FaSortAlphaDown className={`${sortingDate === "DESC"   ? "hidden" : "text-2xl text-primary"}`} onClick={()=>{onButtonSortDate("DESC")}} />
                        <FaSortAlphaUp className={`${sortingDate === "ASC" || sortingDate === "" ? "hidden" : "text-2xl text-primary"}`} onClick={()=>{onButtonSortDate("ASC")}}/>
                    </div>
                    <Button isButton isPrimary isSecondary={sortingDate === ""} isDisabled={sortingDate === ""}
                        className="flex mx-5 items-center"
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
                <div>
                    <table className="text-gray-500 w-full text-left text-sm">
                        <thead className="text-gray-700 bg-slate-100 text-sm uppercase">
                            <tr>
                                <th className="p-3">Tanggal</th>
                                <th className="p-3">Pertanyaan</th>
                                <th className="p-3">Jawaban</th>
                                <th className="p-3">Pengguna</th>
                                <th className="p-3">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questionList.map((list) => {
                                return (
                                    <tr className="items-center text-left">
                                        <th className="p-3 ">{formatDate(list.createdAt)}</th>
                                        <th className="p-3 ">{list.question}</th>
                                        <th className="p-3 break-all max-w-sm">{list.answer}</th>
                                        <td className="p-3 ">{list.user_profile.name}</td>
                                        <td className="p-3 ">
                                            <div className="flex gap-3">
                                                <Button isSmall isPrimaryOutline title={`${list.answer ? "Edit" :"Jawab"}`}
                                                    onClick={() =>{
                                                        handleShowModal({context : "Jawab Pertanyaan"})
                                                        setSelectedQuestion(list)
                                                    }}
                                                />
                                                <Button isSmall isDanger
                                                    onClick={() =>{
                                                        handleShowModal({context : "Hapus Pertanyaan"})
                                                        setSelectedQuestion(list)
                                                    }}
                                                >
                                                    <HiOutlineTrash className="text-lg" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="w-full flex items-center justify-center">
                    <Pagination 
                        onChangePagination={onChangePagination}
                        disabledPrev={Number(currentPage) === 1}
                        disabledNext={currentPage >= totalPage}
                        currentPage={currentPage}
                    />
                </div>
            </div>
            <Modal
                showModal={showModal.show}
                closeModal={handleCloseModal}
                title={showModal.context}
            >
                {(showModal.context === "Jawab Pertanyaan" && !success) && (
                    <div className="flex max-h-[75vh] flex-col overflow-auto px-2">
                        <p className="mt-2"> Pertanyaan dari {selectedQuestion.user_profile.name} : </p>
                        <p className="mt-2"> " {selectedQuestion.question} " </p>
                        <p className="mt-2">Jawaban : </p>
                        <textarea ref={answerRef} type="text-area" className="border-2 p-3 rounded-md" rows="5" cols="33" defaultValue={`${selectedQuestion.answer ? selectedQuestion.answer :""}`} />
                        <div className={`${confirmation ? "hidden" : "mt-4 flex gap-2"}`}>
                            <Button title="Back" isButton isSecondary 
                                onClick={() =>handleCloseModal()}
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
                            Anda yakin akan menhapus pertanyaan dari {selectedQuestion.user_profile.name} ?
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
                            Are you sure you want to save these changes?
                        </p>
                        <div className="flex gap-2">
                            <Button title="Cancel"  isButton  isSecondary 
                                onClick={() => setConfirmation(false)}
                            />
                            <Button title="Sure" isButton isPrimary
                                onClick={handleOnSure}
                            >
                                Sure
                            </Button>
                        </div>
                    </div>
                )}
                {success && (
                    <SuccessMessage
                        type="success"
                        message={
                            `Pertanyaan ${showModal.context === "Hapus Pertanyaan" 
                            ? `${selectedQuestion.user_profile?.name} berhasil dihapus` 
                            : `${selectedQuestion.user_profile?.name} berhasil dijawab`}`}
                        handleCloseModal={() =>handleCloseModal()}
                    />
                )}
            </Modal>
        </div>
    )
}
export default ForumPage