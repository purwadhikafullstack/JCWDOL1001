import React, { useState } from 'react'
import { HiOutlineTrash } from 'react-icons/hi2';

export default function FilterDropdownMenu({ handleSort, setFilterType }) {
  const [activeFilter, setActiveFilter] = useState(null);

  return (
    <div className="absolute z-50 w-full opacity-0 group-hover:opacity-100">
      <div className="mt-1 h-fit rounded-lg border border-primary bg-slate-100 p-2 shadow-md">
        <div
          className="flex cursor-pointer gap-2 rounded-md p-1 hover:border hover:border-primary"
          onClick={() => {
            handleSort("price", "ASC");
            setActiveFilter("price-asc")
            setFilterType("Harga Terendah")
          }}
        >
          <input
            type="radio"
            id="price-asc"
            name="filter"
            className="cursor-pointer"
            value="price-asc"
            checked={activeFilter === "price-asc"}
          />
          <label
            className="w-full cursor-pointer"
            htmlFor="price-asc"
          >
            Harga Terendah
          </label>
        </div>

        <div
          className="flex cursor-pointer gap-2 rounded-md p-1 hover:border hover:border-primary"
          onClick={() => {
            handleSort("price", "DESC");
            setActiveFilter("price-desc")
            setFilterType("Harga Tertinggi")
          }}
        >
          <input
            type="radio"
            id="price-desc"
            name="filter"
            className="cursor-pointer"
            value="price-desc"
            checked={activeFilter === "price-desc"}
          />
          <label
            className="w-full cursor-pointer"
            htmlFor="price-desc"
          >
            Harga Tertinggi
          </label>
        </div>

        <div
          className="flex cursor-pointer gap-2 rounded-md p-1 hover:border hover:border-primary"
          onClick={() => {
            handleSort("name", "ASC");
            setActiveFilter("name-asc")
            setFilterType("Nama A - Z")
          }}
        >
          <input
            type="radio"
            id="name-asc"
            name="filter"
            className="cursor-pointer"
            value="name-asc"
            checked={activeFilter === "name-asc"}
          />
          <label
            className="w-full cursor-pointer"
            htmlFor="name-asc"
          >
            Nama A - Z
          </label>
        </div>

        <div
          className="flex cursor-pointer gap-2 rounded-md p-1 hover:border hover:border-primary"
          onClick={() => {
            handleSort("name", "DESC");
            setActiveFilter("name-desc")
            setFilterType("Nama Z - A")
          }}
        >
          <input
            type="radio"
            id="name-desc"
            name="filter"
            className="cursor-pointer"
            value="price-asc"
            checked={activeFilter === "name-desc"}
          />
          <label
            className="w-full cursor-pointer"
            htmlFor="name-desc"
          >
            Nama Z - A
          </label>
        </div>

        <div
          className="cursor-pointer flex gap-2 items-center px-0.5 py-1 hover:border hover:border-primary rounded-md"
          onClick={() => {
            handleSort("", "");
            setActiveFilter("")
            setFilterType(null)
          }}
        >
          <HiOutlineTrash className="text-danger"/>
          Hapus Filter
        </div>
      </div>
    </div>
  )
}
