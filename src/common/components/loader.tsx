

const LoaderComponent = () => {
  return (
    <div className="flex justify-center items-center space-x-4">
      <div className="w-5 h-5 bg-primary   rounded-full animate-bubble"></div>
      <div className="w-5 h-5  bg-primary rounded-full animate-bubble delay-200"></div>
      <div className="w-5 h-5  bg-primary rounded-full animate-bubble delay-400"></div>
    </div>
  )
}

export default LoaderComponent