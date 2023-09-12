import React from "react"
import propTypes from "prop-types"
import { Link } from "react-router-dom"

export default function Button(props) {
  const className = [props.className]
  props.isButton && className.push("px-6 py-2 rounded-lg select-none text-sm")

  props.isSmall && className.push("px-2 py-1 rounded-md select-none text-sm")

  props.isPrimary &&
    !props.isDisabled &&
    className.push("bg-primary hover:bg-teal-700 text-white duration-300")

  props.isPrimary &&
    props.isDisabled &&
    className.push(
      "bg-primary/70 text-white hover:cursor-default dark:bg-primary/40"
    );

  props.isPrimaryOutline &&
    className.push(
      "bg-inherit text-primary border border-primary hover:bg-primary hover:text-white duration-300"
    );

  props.isDanger &&
    className.push("bg-red-500 hover:bg-red-600 text-white duration-300")

  props.isWarning &&
    className.push("bg-yellow-500 hover:bg-yellow-600 text-white duration-300")

  props.isSecondary &&
    className.push("bg-slate-400 hover:bg-slate-500 text-white duration-300")

  props.isBLock && className.push("w-full")

  const onClick = () => {
    props.onClick && !props.isDisabled && props.onClick()
  };

  if (props.isLink) {
    return (
      <Link
        to={props.path}
        className={className.join(" ")}
        onClick={(e) => {
          // e.stopPropagation()
          onClick()
        }}
      >
        {props.title ? props.title : props.children}
      </Link>
    )
  }

  return (
    <button
      className={className.join(" ")}
      type={props.type ? props.type : "button"}
      onClick={() => {
        // e.preventDefault()
        onClick()
      }}
      disabled={props.isLoading}
    >
      {
        props.isLoading ? 
          <div className="mx-auto block h-6 w-6 animate-spin rounded-full border-[3px] border-r-transparent">
            <span className="sr-only">Loading...</span>
          </div>

        : props.title ?
          props.title

        : props.children
      }
    </button>
  )
}

Button.propTypes = {
  type: propTypes.oneOf(["button", "submit"]),
  onClick: propTypes.func,
  path: propTypes.string,
  title: propTypes.oneOfType([propTypes.string, propTypes.object]),
  className: propTypes.string,
  isDisabled: propTypes.bool,
  isLoading: propTypes.bool,
  isBLock: propTypes.bool,
  hasShadow: propTypes.bool,
  isButton: propTypes.bool,
  isSmall: propTypes.bool,
  isPrimary: propTypes.bool,
  isPrimaryOutline: propTypes.bool,
  isDanger: propTypes.bool,
  isWarning: propTypes.bool,
  isSecondary: propTypes.bool,
  isLink: propTypes.bool,
};
