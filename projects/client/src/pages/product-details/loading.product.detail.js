export default function LoadingProductDetail() {
  return (
    <div className="container py-24">
      <div className="animate-pulse grid grid-cols-1 lg:mt-8 lg:grid-cols-5 lg:gap-8">
        <div className="col-span-2 rounded-lg aspect-[5/4] w-full bg-slate-300" />

        <div className="col-span-2 flex w-full flex-col gap-2 mt-4">
          <div className="w-80 rounded-md h-4 bg bg-slate-300" />
          <div className="w-64 rounded-md h-4 bg bg-slate-300" />
          <div className="mt-12 w-80 rounded-md h-4 bg bg-slate-300" />
          <div className="w-72 rounded-md h-4 bg bg-slate-300" />
          <div className="w-64 rounded-md h-4 bg bg-slate-300" />
        </div>

        <div className="col-span-1 mt-4 flex h-fit w-full flex-col gap-4 rounded-lg border p-4 shadow-lg lg:mt-0">
          <div className="w-full rounded-md h-4 bg bg-slate-300" />
          <div className="w-full rounded-md h-12 bg bg-slate-300" />
          <div className="w-1/2 rounded-md h-4 bg bg-slate-300" />
          <div className="w-3/4 rounded-md h-4 bg bg-slate-300" />
        </div>
      </div>
    </div>
  )
}
