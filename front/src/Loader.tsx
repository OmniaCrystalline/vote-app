
const Loader = () => {
    return (
        <p className="h-7 flex gap-5 place-content-center">
            <span className="relative flex size-5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex size-5 rounded-full bg-orange-500"></span>
            </span>
            <span className="relative flex size-5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex size-5 rounded-full bg-sky-500"></span>
            </span>
            <span className="relative flex size-5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex size-5 rounded-full bg-purple-500"></span>
            </span>
        </p>
    )
}

export default Loader