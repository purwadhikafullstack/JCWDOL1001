import Button from "../../../components/Button"
import Pagination from "../../../components/PaginationV2"
import { formatDate,  } from "../../../utils/formatDate"
import { HiOutlineTrash } from "react-icons/hi2"

export default function QuestionsTable ({handleShowModal,setSelectedQuestion,questionList, currentPage, totalPage, setPage}){
    return(
        <>
            <div className="w-full">
                <table className="text-gray-500 w-full text-left text-sm">
                    <thead className="text-gray-700 bg-slate-100 text-sm uppercase">
                        <tr>
                            <th className="p-3">Tanggal</th>
                            <th className="p-3">Pertanyaan</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Tindakan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questionList?.map((list) => {
                            return (
                                <tr className="items-center text-left w-full">
                                    <th className="p-3 ">{formatDate(list.createdAt)}</th>
                                    <th className="p-3 break-before-all max-w-xs">{list.question}</th>
                                    <th className="p-3 break-before-all max-w-sm">{list.answer ? "Sudah Dijawab" : "Belum Dijawab"}</th>
                                    <td className="p-3 ">
                                        <div className="flex items-center gap-3">
                                            <Button title="Detail" isButton isPrimary
                                                onClick={()=>{
                                                    handleShowModal({context:"Detail Jawaban"})
                                                    setSelectedQuestion(list)
                                                }}
                                            ></Button>
                                            <Button isSmall isDanger={!list.answer} isDisabled={list.answer}
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
                <Pagination currentPage={currentPage} totalPage={totalPage} setPage={setPage}/>
            </div>
        </>
    )
}