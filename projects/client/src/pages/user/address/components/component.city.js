import { useRef, useState } from "react";
function ListOfCity({ city = [], selected }) {
  return city.map((item) => {
    return (
      <option 
        value={[item.city_id, item.city_name]}
        selected={ item.city_name === selected }
        >
        {item.city_name}
      </option>
    );
  });
}

export default function GetCity({
  city = [],
  onCityChange = (cityParams) => {},
  onChange,
  errorInput,
  selected
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectRef = useRef(null);
  return (
    <div className="flex w-full flex-col">
      <span>Kota</span>
      <select
        className={`w-full rounded-lg border bg-inherit px-2 py-2 outline-none
            ${ errorInput ? "border-red-300" : "border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/50"}`}
        ref={selectRef}
        onChange={() => {
          onChange()
          onCityChange(selectRef?.current?.value);
        }}
        onClick={() => setIsDropdownOpen(true)}
      >
        <option disabled={isDropdownOpen}>Pilih Kota </option>
        <ListOfCity
          city={city}
          onCityChange={onCityChange}
          selected={selected} 
        />
      </select>
    </div>
  );
}
