export default function Loading() {
  return Array.from({length : 3}, (_, index)=>(
        <div key={index} className="mt-4 shadow-md animate-pulse h-40 border rounded-lg p-4 flex flex-col justify-between">
          <div className="h-4 md:w-1/2 bg-slate-300 rounded-lg"></div>
          <div className="h-4 w-2/3 md:w-1/3 bg-slate-400 rounded-lg"></div>
          <div className="h-4 w-3/4 md:w-1/4 bg-slate-300 rounded-lg"></div>
          <div className="h-4 md:w-1/3 bg-slate-400 rounded-lg"></div>
        </div>
      ))
}
