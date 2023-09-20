import { useRef, useState } from "react";
function ListOfCity({ city = [], selected }) {
  return city.map((item) => {
    const name = item.type + " " + item.city_name;
    return (
      <option 
        value={name}
        selected={ name === selected }
        >
        {name}
      </option>
    );
  });
}

export default function GetCity({
  city = [],
  onCityChange = (cityParams) => {},
  selected
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectRef = useRef(null);
  return (
    <div className="flex w-full flex-col">
      <span>Kota</span>
      <select
        className="w-full rounded-lg border border-slate-300 bg-inherit px-2 py-2 outline-none
            focus:border-primary focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary
            "
        ref={selectRef}
        onChange={() => {
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
