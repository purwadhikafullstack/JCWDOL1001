import Button from "../../../components/Button";

export default function Categories({ categories }) {

  return (
    <>
      <h3 className="title">Kategori</h3>
      <div className="relative">
        <div
          className="categories-wrapper flex gap-4 overflow-x-auto scroll-smooth px-2 py-4"
        >
          {categories.map((category) => (
            <Button
              isLink
              path="/"
              key={category.id}
              className="flex w-48 flex-shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg px-3 py-3 shadow-lg hover:bg-slate-100 md:py-6"
            >
              <div className="h-8 w-8 md:h-10 md:w-10">
                <img src={process.env.CLOUDINARY_BASE_URL+ categories.categoryPicture} alt="" />
              </div>
              <p className="text-sm font-bold text-dark md:text-base">
                {category.categoryDesc}
              </p>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
