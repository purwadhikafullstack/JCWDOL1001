import { useRef, useState } from "react";

function ListOfProvince({ province = [], selected }) {
  return province.map((item) => {
    return (
      <option
        value={[item.province_id, item.province_name]}
        selected={item.province_name === selected ? "selected" : ""}
      >
        {item.province_name}
      </option>
    );
  });
}

export default function GetProvince({
  province = [],
  onProvinceChange = (provinceParams) => {},
  selected,
  onChange,
  errorInput
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const selectRef = useRef(null);

  return (
    <div className="flex w-full flex-col">
      <span>Provinsi</span>
      <select
        className={`w-full rounded-lg border bg-inherit px-2 py-2 outline-none
            ${ errorInput ? "border-red-300" : "border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/50"}`}
        ref={selectRef}
        onChange={() => {
          onChange()
          onProvinceChange(selectRef?.current?.value);
        }}
        onClick={() => setIsDropdownOpen(true)}
      >
        <option
          value=""
          className="text-slate-500 hover:bg-red-500"
          disabled={isDropdownOpen}
        >
          Pilih Provinsi
        </option>
        <ListOfProvince province={province} selected={selected} />
      </select>
    </div>
  );
}
