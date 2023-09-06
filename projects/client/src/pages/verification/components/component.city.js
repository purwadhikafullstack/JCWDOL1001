function listOfProvince({
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

export default function GetCity({
    city = [],
    onProvinceChange = (provinceId,provinceName)=>{}
}){
    return(
        <div>
            <select>
                <option>Select Province</option>
                <listOfProvince
                province={province}
                onProvinceChange={onProvinceChange}
                />
            </select>
        </div>
    )
}