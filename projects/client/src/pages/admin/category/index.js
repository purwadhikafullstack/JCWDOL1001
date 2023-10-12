import {useDispatch, useSelector} from "react-redux";
import { useEffect, useRef } from "react";
import { useState } from "react";
import Button from "../../../components/Button/index.js";
import Pagination from "../../../components/PaginationV2";
import InputImage from "../../../components/InputImage";
import Input from "../../../components/Input";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { motion } from "framer-motion";
import {getCategory,addCategory,updateCategory,updateCategoryPicture,deleteCategory} from "../../../store/slices/cat/slices.js";
import Modal from "../../../components/Modal/index.js";

export default function CategoryList(){
    const dispatch = useDispatch()
    const [newPage, setNewPage] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [categoryIndex, setCategoryIndex] = useState(null);
    const [fileImage, setFileImage] = useState(null);
    const [searchedCategory, setSearchedCategory] = useState(null)
    const [page, setPage] = useState(1);
    const categoryNameRef = useRef();
    const searchedCategoryRef = useRef();
    const formData = new FormData();
    const [showModal, setShowModal] = useState(false)
    
    const {category, isAddLoading, isDeleteLoading, isUpdateLoading, currentPage, totalPage} = useSelector(state => {
        return {
            category : state?.cat?.category,
            isAddLoading : state?.cat?.isAddLoading,
            isDeleteLoading : state?.cat?.isDeleteLoading,
            isUpdateLoading : state?.cat?.isUpdateLoading,
            currentPage : state?.cat?.currentPage,
            totalPage : state?.cat?.totalPage
        }
    })
    
    useEffect(()=>{
        dispatch(getCategory({page : page, searchedCategory : searchedCategory}));
    },[page, isAddLoading, isDeleteLoading, isUpdateLoading, searchedCategory])

    const onButtonClick = (context) => {
        if(context === "add"){
            const data = {"categoryDesc":categoryNameRef.current.value};
            const appendData = JSON.stringify(data)
            formData.append('file',fileImage)
            formData.append('data',appendData)
            dispatch(addCategory(formData))
            setNewPage(null)
            setFileImage(null)
        }
        else if(context === "delete"){
            dispatch(deleteCategory({categoryId : categoryId}));
            setNewPage(null)
        }
        else if(context === "update"){
            dispatch(updateCategory({categoryId : categoryId, categoryDesc : categoryNameRef.current.value}))
            setNewPage(null)
        }
        else{
            formData.append('file',fileImage)
            dispatch(updateCategoryPicture({formData, categoryId}))
            setNewPage(null)
            setFileImage(null)
        }
    }

    const optionPage = () => {
        switch(newPage){
            case 'add' : 
                return(
                <div className="overflow-x-auto">
                    <h3 className="title">Tambah Kategori</h3>
                    <form className="mt-4">
                        <div>
                            <Input type="text" placeholder="Nama Kategori" label="Nama Kategori" required ref={categoryNameRef}/>
                        </div>
                        <div className="mt-4">
                            <InputImage file={fileImage} setFile={setFileImage}/>
                        </div>
                        <div className="flex justify-center gap-2 mt-4">
                        <Button isButton isDanger title="Kembali" className="" onClick={()=>{
                            setShowModal(false)
                            }}/>
                        <Button isButton isPrimary type="submit" title="Tambah" className="" onClick={()=>onButtonClick("add")}/>
                        </div>
                    </form>
                </div>)
            case 'delete' : return(
                <div className="overflow-x-auto">
                    <h3 className="title">Hapus Kategori</h3>
                    <h2 className="my-4">Apa kamu yakin ingin menghapus kategori nomor {categoryIndex} ?</h2>
                    <form className="flex justify-center gap-2 mt-4">
                        <Button isButton isDanger title="Kembali" className="" onClick={()=>{
                            setShowModal(false)
                            }}/>
                        <Button isButton isPrimary type="submit" title="Hapus" className="" onClick={()=>onButtonClick("delete")}/>
                    </form>
                </div>
            )
            case 'update' :
                return(
                <div className="overflow-x-auto">
                    <h3 className="title">Ubah Nama Kategori</h3>
                    <form className="mt-4">
                        <div>
                            <Input type="text" placeholder="Ubah Kategori" label={`Ubah Kategori nomor ${categoryIndex}`} required ref={categoryNameRef}/>
                        </div>
                        <div className="flex justify-center gap-2 mt-4">
                        <Button isButton isDanger title="Kembali" className="" onClick={()=>{
                            setShowModal(false)
                            }}/>
                        <Button isButton isPrimary type="submit" title="Ubah" className="" onClick={()=>onButtonClick("update")}/>
                        </div>
                    </form>
                </div>
            )
            case 'updateImage' :
                return(
                    <div className="overflow-x-auto">
                        <h3 className="title">Ubah Gambar Kategori</h3>
                        <form className="mt-4">
                            <div>
                                <InputImage file={fileImage} setFile={setFileImage}/>
                                <div className="flex justify-center gap-2 mt-4">
                                <Button isButton isDanger title="Kembali" className="" onClick={()=>{
                                    setShowModal(false)
                                    }}/>
                                <Button isButton isPrimary type="submit" title="Ubah" className="" onClick={()=>onButtonClick("updateImage")}/>
                                </div>
                            </div>
                        </form>
                    </div>
                )
            default : return null;
        }
    }

    const handleButtonClick = (categoryId, categoryIndex, context) => {
        setFileImage(null);
        setNewPage(context);
        setCategoryId(categoryId);
        setCategoryIndex(categoryIndex);
        setShowModal(true)
    }

    const handleCloseModal = () => setShowModal(false)

    return(
        <div className="container py-24 ml-[calc(5rem)] lg:px-8">

            <div className="overflow-x-auto sm:rounded-lg">
                <div className="flex flex-row justify-between">
                    <h3 className="title w-1/2"> Kategori </h3>
                    <form className="relative w-1/3">
                        <Input type="text" placeholder="Cari Kategori..." ref={searchedCategoryRef}/>
                        <button className="absolute top-1/2 right-0 -translate-y-1/2 p-2" type="button" onClick={()=>setSearchedCategory(searchedCategoryRef?.current.value)}>
                            <HiMagnifyingGlass className="text-2xl text-primary" />
                        </button>
                    </form>
                </div>
            </div>

            <Button isPrimary isButton onClick={()=>{
                setNewPage('add')
                setShowModal(true)
            }} title={"Tambah Kategori Baru"} className=""/>

            <div className="relative overflow-x-auto mt-2">
                <table className="text-gray-500 w-full text-left text-sm">
                    <thead className="text-gray-700 bg-slate-100 text-sm uppercase">
                        <tr>
                            <th scope="col" className="p-3">
                                No.
                            </th>
                            <th scope="col" className="p-3">
                                Nama Kategori
                            </th>
                            <th scope="col" className="p-3">
                                Gambar Kategori
                            </th>
                            <th scope="col" className="p-3 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            category ?
                            category?.map((category, index)=>(
                            <motion.tr  
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.1, delay: index * 0.05 }}
                                key={index}
                                className="odd:bg-slate-200/70 even:bg-slate-100"
                                >
                                <th scope="row" className="p-3" key={index}>
                                    {index+1}
                                </th>
                                <td className="p-3 font-semibold">
                                    {category.categoryDesc}
                                </td>
                                <td className="p-3">
                                    <img className="w-10 h-10" src={process.env.REACT_APP_CLOUDINARY_BASE_URL+ category.categoryPicture} />
                                </td>
                                <td className="p-3 flex gap-2">
                                <Button isPrimary isButton onClick={()=>handleButtonClick(category.categoryId, index+1, "update")} title={"Ubah Nama Kategori"} className=""/>
                                <Button isPrimaryOutline isButton onClick={()=>handleButtonClick(category.categoryId, index+1, "updateImage")} title={"Ubah Gambar Kategori"} className=""/>
                                <Button isDanger isButton onClick={()=>handleButtonClick(category.categoryId, index+1, "delete")} title={"Hapus"} className=""/>
                                </td>
                            </motion.tr>))
                            :
                            <tr>
                            </tr>
                        }
                    </tbody>
                </table>

                <Pagination currentPage={currentPage} totalPage={totalPage} setPage={setPage}/>
            </div>
            
            <Modal
                showModal={showModal}
                closeModal={handleCloseModal}
            >
                {optionPage()}
            </Modal>
        </div>


    )
}