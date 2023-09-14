import { HiXMark } from "react-icons/hi2"
import Button from "../../../../components/Button"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function ProductList({
    data,
    onEdit,
    selectedProducts,
    setSelectedProducts,
    products
}) {
    const [showAllProduct, setShowAllProduct] = useState(false)

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
    };
    useEffect(() => {
        setSelectedProducts(data?.productDiscount);
    }, [data])
    
    return (
        <div className=" px-2 mt-5 rounded-md">
            <h3 className="title mt-4 border-b-2 mb-3">Products List : </h3>
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
                            {selectedProduct.productName}
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
                title = "Add Product"
                onClick = {()=>setShowAllProduct(true)}
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
                        <div className="flex items-center justify-between">
                            <h3 className="title">Choose Product</h3>
                            <span
                                className="cursor-pointer"
                                onClick={() => setShowAllProduct(false)}
                            >
                            <HiXMark className="text-3xl" />
                            </span>
                        </div>

                    <div className="my-4 max-h-[55vh] divide-y-2 overflow-auto">
                        {products.map((product) => (
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
                    </div>

                    <div className="flex gap-2">
                        <Button
                            isButton
                            isPrimary
                            isBLock
                            title="Done"
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