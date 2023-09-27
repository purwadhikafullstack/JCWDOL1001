import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AnswerQuestion, deleteQuestion, getForum } from "../../../store/slices/forum/slices"
import { HiOutlineTrash } from "react-icons/hi2"
import Button from "../../../components/Button"
import Pagination from "../../../components/Pagination"
import Modal from "../../../components/Modal"
import Input from "../../../components/Input"
import SuccessMessage from "../../../components/Message"

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

    const [showModal, setShowModal] = useState({ show: false, context: "" })
  
    const [selectedQuestion, setSelectedQuestion] = useState([])

    const answerRef = useRef()

    const [confirmation, setConfirmation] = useState(false);


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


    useEffect(() => {
        dispatch(getForum())
    }, [])

    

    return (
        <div className="container py-24 lg:ml-[calc(5rem)] lg:px-8">
            <div className="pb-10">
                <a className="flex items-center normal-case text-[20pt] pb-3">
                    Daftar Pertanyaan
                </a>
                <div>
                    <table className="text-gray-500 w-full text-left text-sm">
                        <thead className="text-gray-700 bg-slate-100 text-sm uppercase">
                            <tr>
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
                                        <th className="p-3 ">{list.question}</th>
                                        <th className="p-3 break-all max-w-sm">{list.answer}</th>
                                        <td className="p-3 ">{list.user_profile.name}</td>
                                        <td className="p-3 ">
                                            <div className="flex gap-3">
                                                <Button isSmall isPrimaryOutline title="Jawab" className={`${list.answer ? "hidden" :""}`}
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
                        <Input ref={answerRef} type="textarea"/>
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