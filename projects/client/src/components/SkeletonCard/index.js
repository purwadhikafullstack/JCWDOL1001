export default function SkeletonCard() {
  return (
    <div
      className="flex flex-col gap-2 rounded-lg border p-3 text-dark shadow-lg animate-pulse"
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-slate-300"/>

      <div className="bg-slate-400 w-full h-4 rounded-md" />
      <div className="bg-slate-300 w-1/2 h-4 rounded-md" />
      <div className="h-8 w-full overflow-hidden rounded-md bg-slate-400"/>
    </div>
  );
}
