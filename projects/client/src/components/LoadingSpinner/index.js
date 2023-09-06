import propTypes from "prop-types"

export default function LoadingSpinner(props) {
  const className = [props.className]

  className.push("mx-auto block animate-spin rounded-full border-primary border-r-transparent")
  props.isSmall && className.push("h-6 w-6 border-[3px]")
  props.isLarge && className.push("h-10 w-10 border-4")
  
  return (
    <div className={className.join(" ")}>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

LoadingSpinner.propTypes = {
  isSmall: propTypes.bool,
  isLarge: propTypes.bool,
}