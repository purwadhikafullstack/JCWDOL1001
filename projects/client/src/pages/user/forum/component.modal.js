import { useDispatch } from "react-redux"
import Button from "../../../components/Button"
import Input from "../../../components/Input"
import Modal from "../../../components/Modal"
import { deleteQuestion } from "../../../store/slices/forum/slices"
import { formatDate, formatTime } from "../../../utils/formatDate"
import Message from "../../../components/Message"

export default function ModalCondition ({
    showModal, 
    handleCloseModal ,
    profile, 
    setError, 
    inputQuestionRef, 
    error, 
    confirmation, 
    setConfirmation,
    selectedQuestion,
    isLoading,
    success,
    handleOnSure,
    isToastVisible
}){
    const dispatch = useDispatch()
    return (
        <Modal fullWidth
            showModal={showModal.show}
            closeModal={handleCloseModal}
            title={showModal.context}
        >
            {(showModal.context === "Memberikan Pertanyaan" && !success) && (
                <div className="flex max-h-[75vh] flex-col overflow-auto px-2">
                    <p className="mt-2">Nama Pengguna : </p>
                    <p className="mt-2">{profile.name} </p>
                    <p className="mt-2">Masukan Pertanyaan Anda : </p>
                    <Input ref={inputQuestionRef} type="textarea" 
                        errorInput={error.question }
                        onChange={() => setError({ ...error, question: false })}
                    />
                    {error.question && (
                        <div className="text-sm text-red-500 dark:text-red-400">
                            {error.question}
                        </div>
                    )}
                    <div className={`${confirmation ? "hidden" : "mt-4 flex gap-2"}`}>
                        <Button title="Kembali" isButton isSecondary 
                            onClick={() =>{
                                handleCloseModal()
                                setError({ ...error, question: false })
                            }}
                        />
                        <Button isButton isPrimary title="Tanyakan"
                            onClick={()=>{setConfirmation(true)}}
                        />
                    </div>
                </div>
            )}
            {showModal.context === "Detail Jawaban"  && (
                <>
                <div className="flex flex-col gap-2 items-left mt-3 mb-5">
                    <p>Pertanyaan : </p>
                    <p className="p-1">{selectedQuestion.question}</p>
                </div>
                <div className="border-2 rounded-md p-2">
                    <p className="text-sm text-left text-dark md:text-base">
                    Dijawab :
                    </p>
                    <p className="text-sm  text-dark md:text-base">
                    {formatDate(selectedQuestion.updatedAt)}
                    </p>
                    <p className="text-sm  text-dark md:text-base">
                    {formatTime(selectedQuestion.updatedAt)}
                    </p>
                    <p className="text-sm pt-5 break-before-all font-bold text-dark md:text-base">
                    " {selectedQuestion.answer} "
                    </p>
                </div>
                </>
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
                        Apakah pertanyaan Anda sudah benar?
                    </p>
                    <div className="flex gap-2">
                        <Button title="Batal"  isButton  isSecondary 
                            onClick={() => setConfirmation(false)}
                        />
                        <Button title="Iya" isButton isPrimary isDisabled={isToastVisible}
                            onClick={handleOnSure}
                        />
                    </div>
                </div>
            )}
            {success && (
                <Message
                    type="success"
                    message={
                        `Pertanyaan ${showModal.context === "Hapus Pertanyaan" 
                        ? `" ${selectedQuestion.question} " berhasil dihapus` 
                        : `" ${inputQuestionRef?.current?.value} " berhasil ditanyakan`}`}
                    handleCloseModal={() =>handleCloseModal()}
                />
            )}
        </Modal>
    )
}