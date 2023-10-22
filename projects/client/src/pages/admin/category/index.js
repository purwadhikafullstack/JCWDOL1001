import {useDispatch, useSelector} from "react-redux";
import { useEffect, useRef } from "react";
import { useState } from "react";
import Button from "../../../components/Button/index.js";
import Pagination from "../../../components/PaginationV2";
import InputImage from "../../../components/InputImage";
import Input from "../../../components/Input";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import { motion } from "framer-motion";
import {getCategory,addCategory,updateCategory,updateCategoryPicture,deleteCategory} from "../../../store/slices/cat/slices.js";
import Modal from "../../../components/Modal/index.js";

export default function CategoryList(){
    const dispatch = useDispatch()
    const [newPage, setNewPage] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [fileImage, setFileImage] = useState(null);
    const [searchedCategory, setSearchedCategory] = useState(null)
    const [sortCat, setSortCat] = useState(null);
    const [page, setPage] = useState(1);
    const [categoryDesc, setCategoryDesc] = useState(null);
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
        dispatch(getCategory({page : page, searchedCategory : searchedCategory, sortCat : sortCat}));
    },[page, isAddLoading, isDeleteLoading, isUpdateLoading, searchedCategory, sortCat])

    const onButtonClick = (context) => {
        if(context === "add"){
            const data = {"categoryDesc":categoryNameRef.current.value};
            const appendData = JSON.stringify(data)
            formData.append('file',fileImage)
            formData.append('data',appendData)
            dispatch(addCategory(formData)).then(()=>setShowModal(false))
            setNewPage(null)
            setFileImage(null)
        }
        else if(context === "delete"){
            dispatch(deleteCategory({categoryId : categoryId})).then(()=>setShowModal(false));
            setNewPage(null)
        }
        else if(context === "update"){
            dispatch(updateCategory({categoryId : categoryId, categoryDesc : categoryNameRef.current.value})).then(()=>setShowModal(false));
            setNewPage(null)
        }
        else{
            formData.append('file',fileImage)
            dispatch(updateCategoryPicture({formData, categoryId})).then(()=>setShowModal(false));
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
                    <h2 className="my-4">Apa kamu yakin ingin menghapus kategori {categoryDesc} ?</h2>
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
                            <Input type="text" placeholder="Ubah Kategori" label={`Ubah nama kategori untuk ${categoryDesc}`} required ref={categoryNameRef}/>
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
                        <h3 className="title">Ubah Gambar Kategori {categoryDesc}</h3>
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
            default : return <h1 className="title items-center"> Mohon tunggu sebentar. </h1>
        }
    }

    const handleButtonClick = (categoryId, context, categoryDesc) => {
        setFileImage(null);
        setNewPage(context);
        setCategoryId(categoryId);
        setCategoryDesc(categoryDesc);
        setShowModal(true)
    }

    const handleCloseModal = () => setShowModal(false)

    const handleSearch = (event) => {
    setPage(1)
    event.preventDefault();
    setSearchedCategory(searchedCategoryRef?.current.value)
    };

    const clearSearch = () => {
    setSearchedCategory(null)
    setPage(1)
    searchedCategoryRef.current.value = "";
    }

    return(
        <div className="container py-24 lg:ml-[calc(5rem)] lg:px-8">
            <div className="flex items-center justify-between border-b-2 pb-2 mb-4">
                <h3 className="title w-1/2"> Kategori </h3>
                <form className="relative w-2/5" onSubmit={(e) => {
                    handleSearch(e)
                }}>
                    <Input type="text" placeholder="Cari Kategori..." ref={searchedCategoryRef}/>
                    <Button className="absolute top-1/2 right-0 -translate-y-1/2 p-2" type="submit">
                        <HiMagnifyingGlass className="text-2xl text-primary" />
                    </Button>
                    {searchedCategory && 
                        <Button
                            className="absolute right-8 top-1/2 -translate-y-1/2 p-2"
                            onClick={clearSearch}
                        >
                            <HiXMark className="text-2xl text-primary" />
                        </Button>
                    }
                </form>
            </div>

            <Button isPrimary isButton onClick={()=>{
                setNewPage('add')
                setShowModal(true)
            }} title={"Tambah Kategori Baru"} className=""/>
            <div className="flex gap-2 items-center">
                <label className="ml-4">Sortir Kategori berdasarkan :</label>
                    <select value={sortCat} onChange={(e)=>setSortCat(e.target.value)} className="border outline-primary bg-slate-50 text-sm rounded-lg block p-1.5">
                        <option value={""}></option>
                        <option value={"ASC"}>A-Z</option>
                        <option value={"DESC"}>Z-A</option>
                    </select>
            </div>
            
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

                                <Button isPrimary isButton onClick={()=>handleButtonClick(category.categoryId, "update", category.categoryDesc)} title={"Ubah Nama Kategori"} className=""/>
                                <Button isPrimaryOutline isButton onClick={()=>handleButtonClick(category.categoryId, "updateImage",category.categoryDesc)} title={"Ubah Gambar Kategori"} className=""/>
                                <Button isDanger isButton onClick={()=>handleButtonClick(category.categoryId, "delete",category.categoryDesc)} title={"Hapus"} className=""/>
                                </td>
                            </motion.tr>))
                            :
                            <tr>
                            </tr>
                        }
                    </tbody>
                </table>
                    {totalPage > 1 && <Pagination currentPage={currentPage} totalPage={totalPage} setPage={setPage}/>}
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