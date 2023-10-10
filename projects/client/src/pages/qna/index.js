import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { PostQuestion, getPublicForum } from "../../store/slices/forum/slices"
import Button from "../../components/Button"
import { formatDate, formatDateWithTime, formatTime } from "../../utils/formatDate"
import Modal from "../../components/Modal"
import Message from "../../components/Message"
import Pagination from "../../components/PaginationV2/index.js"
import Input from "../../components/Input"
import { PostQuestionValidationSchema } from "../../store/slices/forum/validation"
import { toast } from "react-toastify"

export default function QnAPage() {
  const { questionList, success, profile, currentPage, totalPage  } = useSelector(state => {
		return {
      questionList : state?.forum?.list,
      success : state?.forum?.success,
      currentPage : state?.forum?.currentPage,
      totalPage : state?.forum?.totalPage,
      profile : state?.auth?.profile
		}
	})

  const dispatch = useDispatch()
  
  const [showModal, setShowModal] = useState({ show: false, context: "" })

  const [selectedQuestion, setSelectedQuestion] = useState([])

  const [confirmation, setConfirmation] = useState(false)

  const [filter,setFilter] = useState(false)

  const inputQuestionRef = useRef()

  const questionRef = useRef()

  const handleShowModal = ({context}) => {
    setShowModal({ show: true, context })
  }

  const handleCloseModal = () => {
    setShowModal({ show: false, context: "" })
    setSelectedQuestion([])
    document.body.style.overflow = "auto"
  }

  const handlePertanyaan = () => {
    profile.length ===0 ? setShowModal({ show: true, context: "login" })
    : handleShowModal({context : "Memberikan Pertanyaan"})
  }

  const clearFilter = () => {
    dispatch(getPublicForum({page:"",filterQuestion:""}))
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

    } catch(error){
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
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getPublicForum({page:page,filterQuestion:""}))
  }, [])
  
  useEffect(() => {
    dispatch( getPublicForum({page:page,filterQuestion:questionRef?.current?.value}) )
  }, [page])


  return (
    <div className="container pt-24 w-[50%]">
      <h3 className="title ">Tanya Apotech</h3>
      <h3 className="text-sm text-slate-400 mb-5 ">Pertanyaan yang ditampilkan hanya pertanyaan yang telah ada jawabannya</h3>
      <Button isSmall isPrimaryOutline isPrimary title="Ingin Bertanya" className="mb-5"
        onClick={handlePertanyaan} />
      <div className="flex gap-4">
        <Input ref={questionRef} type="text" placeholder="Search" />
        <Button isButton isPrimaryOutline
          onClick={()=>{
            dispatch(getPublicForum({filterQuestion : questionRef?.current.value}))
            setFilter(true)}}
        > Cari </Button>
        <button className={`flex flex-row items-center h-auto text-red-700 ${filter ? "" : "hidden"}`}
            onClick={clearFilter} 
        >
            Hapus Pencarian
        </button>
      </div>
      <div className="flex flex-col gap-5 pb-24 mt-10">
        {questionList.map((list) => {
          return (
            <Button className="flex w-full gap-4 rounded-lg px-3 py-3 shadow-lg hover:bg-slate-100 md:py-6"
              onClick={()=>{
                handleShowModal({context:"Detail Jawaban"})
                setSelectedQuestion(list)
              }}
            >
              <div className="nav-profile-img hidden aspect-square w-16 cursor-pointer self-center overflow-hidden rounded-full md:mb-0 lg:block" >
                <img className="h-full w-full object-cover"
                  src={process.env.REACT_APP_CLOUDINARY_BASE_URL + list.user_profile.profilePicture}
                />
              </div>
              <div className="flex w-full">
                <div className="flex flex-col">
                  <p className="text-sm text-left font-bold text-dark md:text-base">
                    " {list.question} "
                  </p>
                  <p className="text-sm text-left text-dark md:text-base">
                    Oleh : {list.user_profile.name}
                  </p>
                </div>
                <div className="flex flex-col grow text-right">
                  <p className="text-sm text-dark md:text-base">
                    {formatDateWithTime(list.createdAt)}
                  </p>
                  <p className="text-sm text-dark md:text-base">
                    Dijawab : {formatDateWithTime(list.updatedAt)}
                  </p>
                </div>
              </div>
            </Button>
          )
        })}
      </div>
      <div className="w-full flex items-center justify-center">
        <Pagination currentPage={currentPage} totalPage={totalPage} setPage={setPage}/>
      </div>
      <Modal 
        showModal={showModal.show}
        closeModal={handleCloseModal}
        context={profile.length ===0 && showModal.context !== "Detail Jawaban"? showModal.context : ""}
        title={profile.length ===0 && showModal.context !== "Detail Jawaban" ? `Login` : showModal.context}
      >
        {showModal.context === "Detail Jawaban"  && (
          <>
            <div className="flex gap-4 items-center mb-5">
              <div className="nav-profile-img hidden  aspect-square w-16 cursor-pointer self-center overflow-hidden rounded-full bg-primary md:mb-0 lg:block" >
                <img
                  src={process.env.REACT_APP_CLOUDINARY_BASE_URL + selectedQuestion.user_profile.profilePicture}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-sm text-left font-bold text-dark md:text-base">
                {selectedQuestion.user_profile.name}
              </p>
              <div className="grow">
                <p className="text-sm text-right text-dark md:text-base">
                  {formatDate(selectedQuestion.createdAt)}
                </p>
                <p className="text-sm text-right text-dark md:text-base">
                  {formatTime(selectedQuestion.createdAt)}
                </p>
              </div>
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
              <p className="text-sm pt-5 break-all font-bold text-dark md:text-base">
                " {selectedQuestion.answer} "
              </p>
            </div>
          </>
        )}        
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
                <Button title="Back" isButton isSecondary 
                  onClick={() =>{
                    handleCloseModal() 
                    setError({ ...error, question: false })
                  }}
                />
                <Button isButton isPrimary title="Confirm"
                  onClick={()=>{setConfirmation(true)}}
                />
            </div>
          </div>
        )}
        {(confirmation && !success) && (
          <div className="pt-10">
            <p className="modal-text">
                Apakah pertanyaan Anda sudah benar?
            </p>
            <div className="flex gap-2">
                <Button title="Cancel" isButton isSecondary 
                  onClick={() => setConfirmation(false)}
                />
                <Button onClick={handleOnSure} title="Sure" isDisabled={isToastVisible} isButton isPrimary >
                  Sure
                </Button>
            </div>
          </div>
        )}
        {success && (
          <Message type="success"
            message={
              `Pertanyaan " ${inputQuestionRef?.current?.value} " berhasil ditanyakan`}
            handleCloseModal={() =>handleCloseModal()}
          />
        )}
      </Modal>
    </div>
  )
}