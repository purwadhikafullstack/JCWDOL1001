import { useRef, useState } from "react"
function ListOfUser({
    user = [],selected
}){
    return user.map((item,index)=>{
        return(
            <option value={[item?.email, item?.userProfile.name, item?.imgRecipe]}
            selected={item?.userProfile.name === selected }
            >
                {item?.userProfile.name}
            </option>
            
        )
    })
}



export default function UserList({
    user = [],
    onUserChange = (params)=>{},
    onChange,
    errorInput,
    selected
}){
    
    const selectRef = useRef(null)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    return(
        <div className="flex flex-col w-full">
            <span className="font-semibold">
                Resep dokter dari customer siapa yang hendak diproses?
            </span>
            <select 
            className= {`w-full rounded-lg border bg-inherit px-2 py-2 outline-none 
            ${ errorInput ? "border-red-300" : "border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/50"}`}
            ref={selectRef} 
            onChange={()=>{
                // onChange()
                onUserChange(selectRef?.current?.value)}}
            onClick={() => setIsDropdownOpen(true)}
            >
                 <option disabled={isDropdownOpen}>Pilih User : </option>
                <ListOfUser
                user={user}
                selected={selected}
                />
            </select>


        </div>
    )
}