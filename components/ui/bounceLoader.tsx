export const BounceLoader = ({className}: {className?: string})=> {
    return(
        <div className={className + ' flex items-center gap-1'}>
            <div className="h-3 w-3 rounded-full bg-background-secondary animate-bounce duration-500">
            </div>

            <div className="h-3 w-3 rounded-full bg-background-secondary animate-bounce duration-500 delay-150">
            </div>

            <div className="h-3 w-3 rounded-full bg-background-secondary animate-bounce duration-500 delay-200">
            </div>
        </div>
    )
}