import {useDispatch, useSelector} from "react-redux";
import { useEffect, useRef } from "react";
import { useState } from "react";
import Button from "../../../components/Button/index.js";
import Pagination from "../../../components/PaginationV2";
import InputImage from "../../../components/InputImage";
import Input from "../../../components/Input";
import { HiMagnifyingGlass } from "react-icons/hi2";
import {getCategory,addCategory,updateCategory,updateCategoryPicture,deleteCategory} from "../../../store/slices/cat/slices.js";

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
                return(<div className="my-4 overflow-x-auto shadow-md sm:rounded-lg py-8">
                    <div className="m-4">
                    <h2 className="font-semibold text-green-900 text-2xl">Tambah Kategori</h2>
                    <form className="space-y-4 md:space-y-6 font-medium text-xl">
                        <div>
                            <Input type="text" placeholder="Tambah Kategori Baru" label="Tambah Kategori Baru" required ref={categoryNameRef}/>
                        </div>
                        <div>
                            <InputImage file={fileImage} setFile={setFileImage}/>
                        </div>
                        <Button isButton isDanger type="submit" title="Kembali!" className="mt-4 py-3 mx-2" onClick={()=>setNewPage(null)}/>
                        <Button isButton isPrimary type="submit" title="Tambah!" className="mt-4 py-3 mx-2" onClick={()=>onButtonClick("add")}/>
                    </form>
                    </div>
                </div>)
            case 'delete' : return(
                <div className="my-4 overflow-x-auto shadow-md sm:rounded-lg py-8">
                    <div className="m-4">
                    <h2 className="font-semibold text-green-900 text-2xl">Hapus Kategori</h2>
                    <h2 className="my-4">Apa kamu yakin ingin menghapus kategori nomor {categoryIndex} ?</h2>
                    <form className="space-y-4 md:space-y-6 font-medium text-xl">
                        <Button isButton isDanger type="submit" title="Kembali!" className="mt-4 py-3 mx-2" onClick={()=>setNewPage(null)}/>
                        <Button isButton isPrimary type="submit" title="Hapus!" className="mt-4 py-3 mx-2" onClick={()=>onButtonClick("delete")}/>
                    </form></div>
                </div>
            )
            case 'update' :
                return(
                <div className="m-4 overflow-x-auto shadow-md sm:rounded-lg py-8">
                    <div className="m-4">
                    <h2 className="font-semibold text-green-900 text-2xl">Ubah Nama Kategori</h2>
                    <form className="space-y-4 md:space-y-6 font-medium text-xl">
                        <div>
                            <Input type="text" placeholder="Ubah Kategori" label={`Ubah Kategori nomor ${categoryIndex}`} required ref={categoryNameRef}/>
                        </div>
                        <Button isButton isDanger type="submit" title="Kembali!" className="mt-4 py-3 mx-2" onClick={()=>setNewPage(null)}/>
                        <Button isButton isPrimary type="submit" title="Ubah!" className="mt-4 py-3 mx-2" onClick={()=>onButtonClick("update")}/>
                    </form>
                    </div>                    
                </div>
            )
            case 'updateImage' :
                return(
                    <div className="m-4 overflow-x-auto shadow-md sm:rounded-lg py-8">
                        <div className="m-4">
                        <h2 className="font-semibold text-green-900 text-2xl">Ubah Gambar Kategori</h2>
                        <h2 className="my-4">Ubah gambar kategori nomor {categoryIndex} </h2>
                        <form className="space-y-4 md:space-y-6 font-medium text-xl">
                            <div>
                                <InputImage file={fileImage} setFile={setFileImage}/>
                                <Button isButton isDanger type="submit" title="Kembali!" className="mt-4 py-3 mx-2" onClick={()=>setNewPage(null)}/>
                                <Button isButton isPrimary type="submit" title="Ubah!" className="mt-4 py-3 mx-2" onClick={()=>onButtonClick("updateImage")}/>
                            </div>
                        </form>
                        </div>
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
    }

    return(
        <div className="container py-24 ml-[calc(5rem)]">
            <div>
                {optionPage()}
            </div>
            <div className="overflow-x-auto shadow-md sm:rounded-lg my-8">
                <div className="flex flex-row border-b-2">
                    <h1 className="text-2xl font-semibold w-1/2"> Kategori </h1>
                    <Button isPrimary isButton onClick={()=>setNewPage('add')} title={"Tambah Kategori Baru"}className="m-3"/>
                    <form className="relative w-1/3">
                        <Input type="text" placeholder="Cari Produk..." ref={searchedCategoryRef}/>
                        <button className="absolute top-1/2 right-0 -translate-y-1/2 p-2" type="button" onClick={()=>setSearchedCategory(searchedCategoryRef?.current.value)}>
                            <HiMagnifyingGlass className="text-2xl text-primary" />
                        </button>
                    </form>
                </div>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="text-gray-500 w-full text-left text-sm">
                    <thead className="text-gray-700 bg-slate-100 text-sm uppercase">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                No.
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Nama Kategori
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Gambar Kategori
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            category ?
                            category?.map((category, index)=>(<tr className="text-gray-900 whitespace-nowrap p-3 font-medium">
                                <th scope="row" className="p-3" key={index}>
                                    {index+1}
                                </th>
                                <td className="p-3 font-semibold">
                                    {category.categoryDesc}
                                </td>
                                <td className="p-3">
                                    <img className="w-10 h-10" src={process.env.REACT_APP_CLOUDINARY_BASE_URL+ category.categoryPicture} />
                                </td>
                                <td className="p-3">
                                <Button isDanger isButton onClick={()=>handleButtonClick(category.categoryId, index+1, "delete")} title={"Hapus"} className="m-3"/>
                                <Button isWarning isButton onClick={()=>handleButtonClick(category.categoryId, index+1, "update")} title={"Ubah Nama Kategori"} className="m-3"/>
                                <Button isWarning isButton onClick={()=>handleButtonClick(category.categoryId, index+1, "updateImage")} title={"Ubah Gambar Kategori"} className="m-3"/>
                                </td>
                            </tr>))
                            :
                            <tr>
                            </tr>
                        }
                    </tbody>
                </table>
                <div className="mt-4 flex items-center justify-center text-center text-green-900 text-lg">
                    <Pagination currentPage={currentPage} totalPage={totalPage} setPage={setPage}/>
                </div>
            </div>
            
        </div>
    )
}