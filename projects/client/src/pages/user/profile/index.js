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
    <div className="w-1/2">
          <InputImage
              file={file}
              setFile={setFile}
              dataImage={dataImage}
              setDataImage={setDataImage}
            /></div>
            <div className="">
              <Button isPrimary isButton isLoading={isChangePictureLoading} isDisabled={!file} title={"Ubah Gambar"} onClick={()=>submitImage()}/>
            </div>
          <div className="col-span-1 p-2 m-2">
          {
            !revision && 
            <div className="py-8 mt-8 border rounded px-6">
            <h1 className="text-4xl">Profile</h1>
            <h2 className="text-2xl py-4">Your Name      : {profile.name}</h2>
            <h2 className="text-2xl py-4">Your Gender    : {profile.gender}</h2>
            <h2 className="text-2xl py-4">Your Birthdate : {profile.birthdate}</h2>
            <h2 className="text-2xl py-4">Your Phone     : {profile.phone}</h2>
            <button className="bg-blue-500 mx-4 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" onClick={()=>setRevision(true)}>Ubah</button>
            </div>
          }
          {
            revision && 
          <div className="py-8 mt-8 border rounded px-6">
            <form>
              <h1 className="text-4xl items-center">Profile</h1>
              <div className="text-2xl py-4 flex flex-row">
                <label for="name" className="">Your Name      :</label>
                <input type="text" id="name" value={name} onChange={(e)=>setName(e.target.value)} className="border"></input>
              </div>
              <div className="text-2xl py-4 flex flex-row">
                <label for="gender" className="" >Your Gender    :</label>
                <select id="gender" value={gender} onChange={(e)=>setGender(e.target.value)} className="border">
                  <option value={"male"}>male</option>
                  <option value={"female"}>female</option>
                </select>
              </div>
              <div className="text-2xl py-4 flex flex-row">
                <label for="birthdate" className="">Your Birthdate :</label>
                <input type="date" id="birthdate" value={birthdate} onChange={(e)=>setBirthdate(e.target.value)} className="border"></input>
              </div>
              <div className="text-2xl py-4 flex flex-row">
                <label for="phone" className="">Your Phone     :</label>
                <input type="tel" id="phone" value={phone} onChange={(e)=>setPhone(e.target.value)} className="border"></input>
              </div>
              <div className="text-2xl py-4 flex flex-row">
                <button type="button" className="bg-green-500 mx-4 hover:bg-green-700 text-white font-bold py-2 px-4 border border-green-700 rounded" onClick={()=>submitData()}>Save changes</button>
                <button type="button" className="bg-red-500 mx-4 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-700 rounded" onClick={()=>setRevision(false)}>Discard changes</button>
              </div>
            </form>
          </div>
          }
          </div>
    </>
  )
}
