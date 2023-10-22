import React, { useEffect } from "react";
import Button from "../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { setOrder } from "../../../store/slices/custom/slices";
import { getOngoingTransactions } from "../../../store/slices/transaction/slices";

export default function ConfirmCustom() {
  const dispatch = useDispatch()
  const {status,role} = useSelector(state=>{
    return{
      status : state?.custom?.status,
      role : state?.auth?.role
    }
  })
  const location = useLocation()
  const token = location.pathname.split('order-')[1]
  useEffect(()=>{
    if(role === 2){
      dispatch(setOrder(token))
    }
  },[])

  useEffect(()=>{
    dispatch(getOngoingTransactions())
  },[status])

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      {role !== 2 && 
      <div>
      <h3 className="title">Silahkan Login</h3>
      <p className="mb-2">Kami ingin memastikan, hanya user yang bisa mmengkonfirmasi pesanan</p>
      </div>
      }
      { (role === 2 && !status) && 
      <div>
      <h3 className="title">Silahkan menunggu</h3>
      <p className="mb-2">Kami akan melakukan verifikasi sebelum membuat pesanan kamu</p>
      </div>}
      {status &&
      <div>
        <h3 className="title">Hore!</h3>
      <p className="mb-2">Pesanan kamu telah dibuat</p>
      <Button
        isButton
        isPrimary
        isLink
        title="Kembali"
        path="/"
      />
      </div>}
      
       
    </div>
  );
}
