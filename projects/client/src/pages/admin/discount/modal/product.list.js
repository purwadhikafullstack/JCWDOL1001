import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Button from "../../../../components/Button"
import Pagination from "../../../../components/PaginationV2/index.js"
import { getProducts } from "../../../../store/slices/product/slices"
import { useDispatch, useSelector } from "react-redux"
import Input from "../../../../components/Input"


export default function ProductList({
    dataDiscount,
    onEdit,
    selectedProducts,
    setSelectedProducts,
    title,
    setError,
    error
}) {
    const [showAllProduct, setShowAllProduct] = useState(false)
    
    const dispatch = useDispatch()

    const {  totalPage, currentPage, products } = useSelector((state) => {
        return {
            totalPage : state?.products?.total_page,
            currentPage : state?.products?.current_page,
            products : state?.products?.data,
        }
    })

    const handleSelectProducts = (event) => {
        
        const productId = +event.target.id

        const isProductSelected = selectedProducts.some((item) => item.productId === productId)

        if (isProductSelected) {
            setSelectedProducts(selectedProducts?.filter((product) => product?.productId !== productId))
        } else {
            const selectedProduct = products?.find((product) => product?.productId === productId)
            setSelectedProducts([...selectedProducts, selectedProduct])
        }
    }

    const handleRemoveProduct = (productId) => {
        setSelectedProducts(selectedProducts.filter((item) => item?.productId !== productId));
    }

    const [page, setPage] = useState(1);
    const searchNameRef = useRef();
    
    useEffect(() => {
        dispatch( getProducts({ page : page }) )
    }, [page])

    useEffect(() => {
        setSelectedProducts(dataDiscount?.productDiscount);
    }, [dataDiscount])

    const onButtonSearch = () =>{
        dispatch( getProducts({ page : page,product_name:searchNameRef.current.value }) )
    }
    
    return (
        <div className=" px-2 mt-5 rounded-md">  
            <h3 className="title mt-4 border-b-2 mb-3">Daftar Produk : </h3>
            {error.product && (
                <div className="text-sm text-red-500 dark:text-red-400">
                    {error.product}
                </div>
            )}          
            <div
                className="mb-2 flex flex-wrap gap-2"
            >
                {selectedProducts?.map((item) => {
                    const selectedProduct = products.find(
                        (product) => +product.productId === +item.productId
                    )
                    return(
                        <Button
                            isPrimary={!onEdit}
                            isPrimaryOutline={onEdit}
                            className="flex items-center rounded-md px-2 py-1 text-sm"
                        >
                            {item?.detailProduct?.productName|| item?.productName}
                            <span
                                className="ml-2 cursor-pointer"
                                onClick={() => handleRemoveProduct(item.productId)}
                            >
                                <HiXMark className={`${!onEdit ? "hidden" : "text-lg" }`} />
                            </span>
                        </Button>
                    )
                })}
            </div>
            <Button
                isButton
                isPrimary
                className = {`${!onEdit ? "hidden" : "lg:justify-self-start w-fit mt-3" }`}
                title = "Tambah Produk"
                onClick = {()=>{setShowAllProduct(true);setError({ ...error, product: false })}}
            />
            <AnimatePresence>
                {showAllProduct && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black/70"
                >
                    <motion.div
                        initial={{ translateY: -20, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        exit={{ translateY: -20, opacity: 0 }}
                        className="h-fit w-full rounded-lg border bg-slate-100 p-4"
                    >
                        <div className="flex items-center relative justify-between">
                            <h3 className="title">Pilih Produk</h3>
                            <Input 
                                type="text" 
                                placeholder="Cari"
                                ref={searchNameRef}
                            />
                            <Button 
                                className="absolute top-1/2 left-[68%] -translate-y-1/2 p-2" 
                                onClick={onButtonSearch}
                            >
                            <HiMagnifyingGlass className="text-2xl text-primary" />
                            </Button>
                            <span
                                className="cursor-pointer"
                                onClick={() => setShowAllProduct(false)}
                            >
                            <HiXMark className="text-3xl" />
                            </span>
                        </div>
                        <div className={title === "Tambah Baru" ? "text-gray-500 mt-2" :""}>{title === "Detail Diskon"  ? "" : "Product yang tidak tersedia sudah memiliki potongan"}</div>

                    <div className="my-4 max-h-[55vh] divide-y-2 text- overflow-auto">
                        {products.filter((product)=>{return title === "Detail Diskon" ? product : product.discountProducts.length === 0 }).map((product) => (
                        <div
                            key={product.productId}
                            className="group mr-2 flex justify-between"
                        >
                            <label
                                htmlFor={product.productId}
                                className="w-full cursor-pointer py-2 duration-300 group-hover:ml-3"
                            >
                                {product.productName}
                            </label>
                            <input
                                type="checkbox"
                                id={product.productId}
                                name={product.productDescription}
                                value={product.productName}
                                onChange={handleSelectProducts}
                                checked={selectedProducts?.some(item => +item?.productId === +product?.productId)}
                                className="cursor-pointer"
                            />
                        </div>
                        ))}
                        <div className="flex justify-center pt-4">
                            <Pagination currentPage={currentPage} totalPage={totalPage} setPage={setPage}/>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            isButton
                            isPrimary
                            isBLock
                            title="Selesai"
                            onClick={() => setShowAllProduct(false)}
                        />
                    </div>
                    </motion.div>
                </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}