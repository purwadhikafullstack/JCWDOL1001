import { useRef } from "react"
function ListOfUser({
    user = [],
}){
    return user.map((item,index)=>{
        return(
            <option value={[item?.email, item?.userProfile.name]}>
                {item?.userProfile.name}
            </option>
            
        )
    })
}



export default function UserList({
    user = [],
    onUserChange = (params)=>{},
    // onIngredientUnitChange = (params)=>{}
}){
    const selectRef = useRef(null)
    // const selectUnitRef = useRef(null)
    return(
        <div className="flex flex-col w-full">
            <span>
                Make custom order for which user?
            </span>
            <select 
            className="w-full rounded-lg border bg-inherit px-2 py-2 outline-none focus:ring-2
            focus:ring-primary/50 dark:focus:ring-primary border-slate-300 focus:border-primary
            "
            ref={selectRef} onChange={()=>{onUserChange(selectRef?.current?.value)}}>
                <option disabled>Select User: </option>
                <ListOfUser
                user={user}
                />
            </select>
            {/* <span>
                Ingredient Unit:
            </span>
            <select 
            className="w-full rounded-lg border bg-inherit px-2 py-2 outline-none focus:ring-2
            focus:ring-primary/50 dark:focus:ring-primary border-slate-300 focus:border-primary
            "
            ref={selectUnitRef} onChange={()=>{onIngredientUnitChange(selectUnitRef?.current?.value)}}>
                <option disabled>Select Secondary Unit: </option>
                <ListOfUnit
                product={product}
                index = {index}
                />
            </select> */}

        </div>
    )
}