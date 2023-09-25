import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { createTransaction, getCheckoutProducts } from "../../../../store/slices/transaction/slices";
import Item from "../../../../components/Item";
import Button from "../../../../components/Button";
import formatNumber from "../../../../utils/formatNumber";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage(){

    const dispatch = useDispatch();
    const navigate = useNavigate();
    let subTotal = 0;
    const [payment, setPayment] = useState(null);
    const [shipping, setShipping] = useState(null);

    const {cart, address} = useSelector((state)=>{
        return {
            cart : state?.transaction?.cart,
        }
    })

    if(cart.length === 0){
        navigate("/")
    }

    useEffect(()=>{
        dispatch(getCheckoutProducts())
    },[])

    const ShippingCost = () => {
        setShipping(9000)
    }

    const PaymentMethod = () => {
        switch(payment){
            case `BCA` :
                return(
                    <div class="my-4 overflow-x-auto w-96 shadow-md sm:rounded-lg py-8 bg-slate-100 text-black items-center text-center">
                        <div>
                            <h3>Please transfer to BCA Bank Account</h3>
                            <h1 className="text-4xl font-bold">9354 220 114</h1>
                            <h2 className="text-2xl font-semibold">APOTEK PRIMA JASA</h2>
                        </div>
                    </div>
                )
            case `Mandiri` :
                return(
                    <div class="my-4 overflow-x-auto w-96 shadow-md sm:rounded-lg py-8 bg-slate-100 text-black items-center text-center">
                        <div>
                            <h3>Please transfer to Mandiri Bank Account</h3>
                            <h1 className="text-4xl font-bold">9112 230 114</h1>
                            <h2 className="text-2xl font-semibold">APOTEK PRIMA MANDIRI</h2>
                        </div>
                    </div>
                )
            default : return null;
        }
    }

    const checkOut = () => {
        dispatch(createTransaction({transport : shipping, totalPrice : (subTotal+shipping), addressId : 2}));
        navigate("/user/transaction");
    }

    return(
        <>
            <div className="container py-24 lg:ml-[calc(5rem)] lg:px-8">
                <div className="mt-4 flex flex-col items-left justify-left pb-2">
                    <div>
                        <h1 className="text-3xl font-semibold w-full border-b-2 mb-5 pb-2">Checkout</h1>
                    </div>
                    <div className="mb-4 border-b-2">
                        <h3 className="text-2xl font-semibold w-full border-b-2 mb-5 pb-2">Order Details</h3>
                        <div className="flex flex-col gap-2 border-green-300">
                        {
                        cart ?
                        cart.map((cart, index)=>{
                            subTotal += cart.cartList.productPrice * cart.quantity;
                            return(<Item
                                key={index}
                                productName={cart.cartList.productName}
                                productPrice={cart.cartList.productPrice}
                                productPicture={cart.cartList.productPicture}
                                quantity={cart.quantity}
                            />)
                            
                        }) :
                        <h1> Your cart is empty as your wallet.</h1> 
                        }</div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold w-full border-b-2 mb-5 pb-2">Shipping</h3>
                        <div className="w-full bg-slate-200 flex flex-row items-center p-4">
                            { shipping && 
                            <>
                                <div className="flex-col">
                                    <h4>Address : Jl. Sakura Miko no.35, Rt.003/Rw.005, Pondok Jagung, Serpong</h4>
                                    <h4>City : Tangerang Selatan</h4>
                                    <h4>Province : Banten</h4>
                                    <h4 className="font-bold text-xl">Shipping cost : {formatNumber(shipping)}</h4>
                                </div>
                            </>
                            }
                            
                        </div>
                        <Button isButton isPrimary title={`Get shipping cost`} className="my-4" onClick={ShippingCost}/>
                    </div>
                    <div className="mb-5 pb-2">
                        <h3 className="text-2xl font-semibold w-full">Payment Method</h3>
                            <select value={payment} className="text-xl border-2 bg-green-200 rounded-lg md:rounded-md" onChange={(e)=>setPayment(e.target.value)}>
                                <option disabled="true">DigitalPayment</option>
                                <option value={"Gopay"}>Gopay</option>
                                <option value={"Ovo"}>OVO</option>
                                <option disabled="true">BankTransfer</option>
                                <option value={"BCA"}>BCA</option>
                                <option value={"Mandiri"}>Mandiri</option>
                            </select>
                            {
                                payment && PaymentMethod() 
                            }
                    </div>
                    <div className="text-2xl font-semibold w-auto border mb-5 pb-2">
                        <h1>Sub Total : Rp. {formatNumber(subTotal)}</h1>
                        {
                            shipping && <><h1>Shipping cost : Rp. {formatNumber(shipping)}</h1>
                            <h1>Grand total : Rp. {formatNumber(subTotal + shipping)}</h1></>
                        }
                        <Button className="" isPrimary isButton title={`Check Out!`} onClick={checkOut}/>
                    </div>
                </div>
            </div>
        </>
    )
}