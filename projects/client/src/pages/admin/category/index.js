import {useDispatch, useSelector} from "react-redux";
import { useEffect, useRef } from "react";
import { useState } from "react";
import Button from "../../../components/Button/index.js";
import Pagination from "../../../components/PaginationV2";
import {getCategory,addCategory,updateCategory,updateCategoryPicture,deleteCategory} from "../../../store/slices/cat/slices.js";

export default function CategoryList(){
    const dispatch = useDispatch()
    const [categoryDesc, setCategoryDesc] = useState(null)
    const [newPage, setNewPage] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [categoryIndex, setCategoryIndex] = useState(null);
    const [fileImage, setFileImage] = useState(null);
    const [page, setPage] = useState(1);
    const categoryNameRef = useRef();
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
        dispatch(getCategory({page : page}));
    },[page, isAddLoading, isDeleteLoading, isUpdateLoading])

    const onButtonClick = (context) => {
        if(context === "add"){
            const data = {"categoryDesc":categoryNameRef.current.value};
            const appendData = JSON.stringify(data)
            formData.append('file',fileImage)
            formData.append('data',appendData)
            dispatch(addCategory(formData))
            setNewPage(null)
        }
        else if(context === "delete"){
            dispatch(deleteCategory({categoryId : categoryId}));
            setNewPage(null)
        }
        else if(context === "update"){
            dispatch(updateCategory({categoryId : categoryId, categoryDesc : categoryDesc}))
            setNewPage(null)
        }
        else{
            formData.append('file',fileImage)
            dispatch(updateCategoryPicture({formData, categoryId}))
            setNewPage(null)
        }
    }

    const optionPage = () => {
        switch(newPage){
            case 'add' : 
                return(<div className="my-4 overflow-x-auto shadow-md sm:rounded-lg py-8 bg-slate-300 text-black">
                    <div className="m-4">
                    <h2 className="font-semibold text-green-900 text-2xl">Tambah Kategori</h2>
                    <form className="space-y-4 md:space-y-6 font-medium text-xl">
                        <div>
                            <label for="categoryName" className="block mb-2 text-xl font-medium text-gray-900 dark:text-white">Nama Kategori</label>
                            <input type="text" className="sm:rounded-lg rounded-xl border" ref={categoryNameRef}/>
                        </div>
                        <div>
                            <label for="categoryImage" className="block mb-2 text-xl font-medium text-gray-900 dark:text-white">Gambar Kategori</label>
                            <input type="file" onChange={(e)=>setFileImage(e.target.files[0])}/>
                        </div>
                        <Button isButton isDanger type="submit" title="Kembali!" className="mt-4 py-3 mx-2" onClick={()=>setNewPage(null)}/>
                        <Button isButton isPrimary type="submit" title="Tambah!" className="mt-4 py-3 mx-2" onClick={()=>onButtonClick("add")}/>
                    </form>
                    </div>
                </div>)
            case 'delete' : return(
                <div className="my-4 overflow-x-auto shadow-md sm:rounded-lg py-8 bg-slate-300 text-black">
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
                <div className="m-4 overflow-x-auto shadow-md sm:rounded-lg py-8 bg-slate-300 text-black">
                    <div className="m-4">
                    <h2 className="font-semibold text-green-900 text-2xl">Ubah Nama Kategori</h2>
                    <h2 className="my-4">Ubah kategori nomor {categoryIndex}</h2>
                    <form className="space-y-4 md:space-y-6 font-medium text-xl">
                        <div>
                            <label for="categoryName" className="block mb-2 text-xl font-medium text-gray-900 dark:text-white">Nama Kategori</label>
                            <input type="text" className="sm:rounded-lg rounded-xl border" onChange={(e)=>setCategoryDesc(e.target.value)}/> 
                        </div>
                        <Button isButton isDanger type="submit" title="Kembali!" className="mt-4 py-3 mx-2" onClick={()=>setNewPage(null)}/>
                        <Button isButton isPrimary type="submit" title="Ubah!" className="mt-4 py-3 mx-2" onClick={()=>onButtonClick("update")}/>
                    </form>
                    </div>                    
                </div>
            )
            case 'updateImage' :
                return(
                    <div className="m-4 overflow-x-auto shadow-md sm:rounded-lg py-8 bg-slate-300 text-black">
                        <div className="m-4">
                        <h2 className="font-semibold text-green-900 text-2xl">Ubah Gambar Kategori</h2>
                        <h2 className="my-4">Ubah gambar kategori nomor {categoryIndex} </h2>
                        <form className="space-y-4 md:space-y-6 font-medium text-xl">
                            <div>
                                <input type="file" onChange={(e)=>setFileImage(e.target.files[0])}/>
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
            <div className="overflow-x-auto shadow-md sm:rounded-lg py-8">
                <div className="flex flex-row border-b-4 border-double border-black">
                    <h1 className="text-4xl flex-1"> Kategori </h1>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4" onClick={()=>setNewPage('add')}>Tambah Kategori</button>
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
                            category?.map((category, index)=>(<tr className="border-b-2 dark:bg-gray-900 dark:border-gray-700">
                                <th scope="row" className="text-gray-900 whitespace-nowrap p-3 font-medium text-medium" key={index}>
                                    {index+1}
                                </th>
                                <td className="p-3 text-center font-semibold text-xl text-green-700">
                                    {category.categoryDesc}
                                </td>
                                <td className="p-3">
                                    <img className="w-10 h-10" src={process.env.REACT_APP_CLOUDINARY_BASE_URL+ category.categoryPicture} />
                                </td>
                                <td className="p-3">
                                <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4
                                 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700
                                 dark:focus:ring-red-900" onClick={()=>handleButtonClick(category.categoryId, index+1, "delete")}>Hapus</button>
                                <button type="button" className="focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4
                                focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2
                                dark:focus:ring-yellow-900" onClick={()=>handleButtonClick(category.categoryId, index+1, "update")}>Ubah Nama Kategori</button>
                                <button type="button" className="focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4
                                focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2
                                dark:focus:ring-yellow-900" onClick={()=>handleButtonClick(category.categoryId, index+1, "updateImage")}>Ubah Gambar Kategori</button>
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