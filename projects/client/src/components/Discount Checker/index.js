import { useRef, useState } from "react"
import Button from "../Button"
import Modal from "../Modal"
import { useDispatch, useSelector } from "react-redux"
import Input from "../Input"
import { checkerDiscount } from "../../store/slices/discount/slices"

export default function DiscountChecker({
    setDiscount
}) {
    const { listDiscount } = useSelector((state) => {
      return {
        listDiscount: state?.discount?.listDiscount,
      }
    })

    const dispatch = useDispatch()

    const inputRef = useRef()
    const [input,setInput] = useState("")

    const discount = []
    
    if(listDiscount.length > 0 && input !== "") {
        discount.push(listDiscount[0])
        // setDiscount(listDiscount[0])
    }

    const clearFilter = () => {
        discount.shift()
        discount.pop()
        setInput("")
    }

    const [showModal, setShowModal] = useState({ show: false, context: ""})

    const handleShowModal = (context) => {
        setShowModal({ show: true, context : context,})
    }

    const handleCloseModal = () => {
        setShowModal({ show: false, context: "" })
        document.body.style.overflow = "auto"
    }

    return (
        <div>
            <div className="flex gap-4">
                {discount.length > 0
                    ? <Input type="button" title={input} value={input}/>
                    : <Input ref={inputRef} type="text" placeholder="Cari kode" />
                }
                <Button isButton isPrimaryOutline
                    className={discount.length > 0 ? "hidden" : ""}
                    onClick={()=>{
                        setInput(inputRef?.current?.value)
                        dispatch(checkerDiscount({"code" : inputRef?.current?.value}))
                    }}
                > Cari </Button>
                <button className={`flex flex-row items-center h-auto text-red-700 ${discount.length > 0 ? "" : "hidden"}`}
                    onClick={clearFilter} 
                >
                    Hapus Kode
                </button>
            </div>
        </div>
    )
}