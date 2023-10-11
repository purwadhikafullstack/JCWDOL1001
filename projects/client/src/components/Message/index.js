import React from "react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi2";
import Button from "../Button";
import propTypes from "prop-types"

export default function Message(props) {

  const onClick = () => {
    props.onClick &&  props.onClick()
  };

    return (
      <div className="flex flex-col items-center justify-center">
        {props.type === "success" ?
        <HiCheckCircle className=" rounded-full bg-slate-100 text-6xl text-primary" />
        :
        <HiXCircle className=" rounded-full bg-slate-100 text-6xl text-danger" />
        }
        <p className="modal-text my-2">{props.message}</p>
        <Button isButton isPrimary onClick={props.handleCloseModal} title="Tutup"/>
      </div>
    );
}

Message.propTypes = {
  type: propTypes.oneOf(["success", "error"]),
  handleCloseModal: propTypes.func,
  message: propTypes.string,
}
