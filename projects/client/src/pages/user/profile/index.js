import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { changeProfileData, changeProfilePicture, getProfile, keepLogin } from "../../../store/slices/auth/slices";
import InputImage from "../../../components/InputImage";
import Button from "../../../components/Button";

export default function Profile() {
  const dispatch = useDispatch();
  const formData = new FormData();

  const {profile, isChangePictureLoading} = useSelector(state=>{
    return {
      profile : state.auth.profile,
      isChangePictureLoading : state.auth.isChangePictureLoading
    }
  })

  const [gender, setGender] = useState(profile.gender);
  const [birthdate, setBirthdate] = useState(profile.birthdate);
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [file, setFile] = useState(null);
  const [dataImage, setDataImage] = useState(null)
  const [revision, setRevision] = useState(false);

  const submitData = () => {
    dispatch(changeProfileData({userId : profile.userId, name : name, gender : gender, birthdate : birthdate, phone : phone}));
    setRevision(false);
  }

  const submitImage = () => {
    formData.append('file',file);
    dispatch(changeProfilePicture({userId : profile.userId,formData : formData}));
    setFile(null);
  }

  useEffect(()=>{
    if(profile.profilePicture){
      setDataImage(profile.profilePicture)
    }
  },[])

  return (
    <>
    <div className="flex flex-row">
      <div className="w-1/2">
          <InputImage
              file={file}
              setFile={setFile}
              dataImage={dataImage}
              setDataImage={setDataImage}
            />
            <div className="m-4">
              <Button isPrimary isButton isLoading={isChangePictureLoading} isDisabled={!file} title={"Ubah Gambar"} onClick={()=>submitImage()}/>
            </div>
      </div>
          <div className="col-span-1 p-2 m-2">
          {
            !revision && 
            <div className="py-8 mt-2 border rounded px-6">
            <h1 className="text-4xl">Profil</h1>
            <h2 className="text-2xl py-4">Nama             : {profile.name}</h2>
            <h2 className="text-2xl py-4">Jenis Kelamin    : {profile.gender}</h2>
            <h2 className="text-2xl py-4">Tanggal Lahir    : {profile.birthdate}</h2>
            <h2 className="text-2xl py-4">No. Handphone    : {profile.phone}</h2>
            <Button isPrimaryOutline isButton title={"Ubah Profile"} onClick={()=>setRevision(true)}/>
            </div>
          }
          {
            revision && 
          <div className="p-4 mt-2 border rounded">
            <form>
              <h1 className="text-4xl items-center">Profil</h1>
              <div className="text-2xl py-4 flex flex-row">
                <label for="name" className="">Nama    :</label>
                <input type="text" id="name" value={name} onChange={(e)=>setName(e.target.value)} className="border"></input>
              </div>
              <div className="text-2xl py-4 flex flex-row">
                <label for="gender" className="" >Jenis Kelamin    :</label>
                <select id="gender" value={gender} onChange={(e)=>setGender(e.target.value)} className="border">
                  <option value={"Laki-Laki"}>Laki-Laki</option>
                  <option value={"Perempuan"}>Perempuan</option>
                </select>
              </div>
              <div className="text-2xl py-4 flex flex-row">
                <label for="birthdate" className="">Tanggal Lahir :</label>
                <input type="date" id="birthdate" value={birthdate} onChange={(e)=>setBirthdate(e.target.value)} className="border" min={"1900-01-01"}></input>
              </div>
              <div className="text-2xl py-4 flex flex-row">
                <label for="phone" className="">No. Handphone :</label>
                <input type="tel" id="phone" value={phone} onChange={(e)=>setPhone(e.target.value)} className="border"></input>
              </div>
              <div className="text-2xl py-4 flex flex-row">
                <Button isPrimary isButton title={"Simpan Profile"} className="m-2" onClick={()=>submitData()}/>
                <Button isDanger isButton title={"Kembali ke Awal"} className="m-2" onClick={()=>setRevision(false)}/>
              </div>
            </form>
          </div>
          }
          </div>
          </div>
    </>
  )
}
