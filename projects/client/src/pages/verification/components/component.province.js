function ListOfProvince({
    province = [],
    onProvinceChange = (provinceId,provinceName)=>{}
}){
    return province.map((item)=>{

        return(
            <option value={item.province_id}
            onClick={()=>{onProvinceChange (item.province_id,item.province)}}>
                item.province
            </option>
            
        )
    })
}

export default function GetProvince({
    province = [],
    onProvinceChange = (provinceId,provinceName)=>{}
}){
    return(
        <div>
            <select>
            <option value={"Select Province :"} disabled>Select Province : </option>
                <ListOfProvince
                province={province}
                onProvinceChange={onProvinceChange}
                />
            </select>
        </div>
    )
}