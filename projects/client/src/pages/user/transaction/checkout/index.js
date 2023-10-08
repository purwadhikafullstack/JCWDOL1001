import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { createTransaction, getCheckoutProducts } from "../../../../store/slices/transaction/slices";
import Item from "../../../../components/Item";
import Button from "../../../../components/Button";
import formatNumber from "../../../../utils/formatNumber";
import { useLocation, useNavigate } from "react-router-dom";
import LogoBca from "../../../../assets/logo-bca.png";
import LogoMandiri from "../../../../assets/logo-mandiri.png";

export default function CheckoutPage(){

    const dispatch = useDispatch();
    const navigate = useNavigate();
    let subTotal = 0;
    const [shipping, setShipping] = useState(null);
    const location = useLocation();
    let address = location.state?.addressSelected;
    let shippings = location.state?.shippingSelected;
    const {cart} = useSelector((state)=>{
        return {
            cart : state?.transaction?.cart,
        }
    })
    
    useEffect(()=>{
        dispatch(getCheckoutProducts())
    },[])

    const ShippingCost = () => {
        setShipping(shippings.cost)
    }

    const PaymentMethod = () => {
                return(
                    <div className="flex flex-row">
                    <div class="m-4 overflow-x-auto w-96 shadow-md sm:rounded-lg py-8 bg-slate-100 text-black items-center text-center">
                        <div>
                            <img src={LogoBca} className=" w-48 h-24 mx-12 items-center justify-center"></img>
                            <h3>Please transfer to BCA Bank Account</h3>
                            <h1 className="text-4xl font-bold">0918023981</h1>
                            <h2 className="text-2xl font-semibold">Apotech Pasti Sukses</h2>
                        </div>
                    </div>
                    <div class="m-4 overflow-x-auto w-96 shadow-md sm:rounded-lg py-8 bg-slate-100 text-black items-center text-center">
                        <div>
                            <img src={LogoMandiri} className="w-48 h-24 mx-12 items-center justify-center"></img>
                            <h3>Please transfer to Mandiri Bank Account</h3>
                            <h1 className="text-4xl font-bold">123456789012</h1>
                            <h2 className="text-2xl font-semibold">Apotech Pasti Sukses</h2>
                        </div>
                    </div>
                    </div>
                )
        }

    const checkOut = () => {
        dispatch(createTransaction({transport : shipping, totalPrice : (+subTotal*1), addressId : address.addressId})).finally(() => navigate("/user/transaction"));
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
                                    <h1 className=" text-3xl font-bold border-b-2 border-black">Contact Name : {address.contactName}</h1>
                                    <h4>Address : {address.address},{address.district}</h4>
                                    <h4>City : {address.city}</h4>
                                    <h4>Province : {address.province}</h4>
                                    <h4>Phone : {address.contactPhone}</h4>
                                    <h4 className="font-bold text-xl">Shipping cost : {formatNumber(shipping)}</h4>
                                </div>
                            </>
                            }
                            
                        </div>
                        <Button isButton isPrimary title={`Get shipping cost`} className="my-4" onClick={ShippingCost}/>
                    </div>
                    <div className="mb-5 pb-2">
                        <h3 className="text-2xl font-semibold w-full">Payment Method</h3>
                            {/*<select value={payment} className="text-xl border-2 bg-green-200 rounded-lg md:rounded-md" onChange={(e)=>setPayment(e.target.value)}>
                                <option value={null}>Please choose your payment Method</option>
                                <option disabled="true">BankTransfer</option>
                                <option value={"BCA"}>BCA</option>
                                <option value={"Mandiri"}>Mandiri</option>
                        </select>*/}
                            {
                                //payment && 
                                PaymentMethod()
                            }
                    </div>
                    <div className="text-2xl font-semibold w-auto border mb-5 pb-2">
                        <h1>Sub Total : Rp. {formatNumber(subTotal)}</h1>
                        {
                            shipping && <><h1>Shipping cost : Rp. {formatNumber(shipping)}</h1>
                            <h1>Grand total : Rp. {formatNumber(subTotal*1 + shipping*1)}</h1></>
                        }
                        <Button className="" isPrimary isButton title={`Check Out!`} onClick={checkOut}/>
                    </div>
                </div>
            </div>
        </>
    )
}