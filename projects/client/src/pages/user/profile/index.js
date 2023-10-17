import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { changeProfileData, changeProfilePicture } from "../../../store/slices/auth/slices";
import InputImage from "../../../components/InputImage";
import Button from "../../../components/Button";
import Input from "../../../components/Input";

export default function Profile() {
  const dispatch = useDispatch();
  const formData = new FormData();

  const { profile, isChangePictureLoading } = useSelector((state) => {
    return {
      profile: state.auth.profile,
      isChangePictureLoading: state.auth.isChangePictureLoading,
    };
  });

  const [gender, setGender] = useState(profile.gender);
  const [birthdate, setBirthdate] = useState(profile.birthdate);
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [file, setFile] = useState(null);
  const [dataImage, setDataImage] = useState(null);
  const [revision, setRevision] = useState(false);

  const submitData = () => {
    dispatch(
      changeProfileData({
        userId: profile.userId,
        name: name,
        gender: gender,
        birthdate: birthdate,
        phone: phone,
      })
    );
    setRevision(false);
  };

  const submitImage = () => {
    formData.append("file", file);
    dispatch(
      changeProfilePicture({ userId: profile.userId, formData: formData })
    );
    setFile(null);
  };

  useEffect(() => {
    if (profile.profilePicture) {
      setDataImage(profile.profilePicture);
    }
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="">
        <h3 className="subtitle">Profil</h3>
        <div className="rounded-lg w-full">
          <form className="w-full">
            <div className="py-2">
              <Input
                type="text"
                id="name"
                isDisabled={!revision}
                value={name}
                onChange={(e) => setName(e.target.value)}
                label="Nama Lengkap"
              />
            </div>
            <div className="flex flex-col py-4">
              <label for="gender" className="">
                Jenis Kelamin
              </label>
              <select
                id="gender"
                disabled={!revision}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={`w-full rounded-lg border bg-inherit px-2 py-2 outline-none border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary`}
              >
                <option value={"Laki-laki"}>Laki-laki</option>
                <option value={"Perempuan"}>Perempuan</option>
              </select>
            </div>
            <div className="py-2">
              <Input
                type="date"
                id="birthdate"
                isDisabled={!revision}
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                label="Tanggal Lahir"
              />
            </div>
            <div className="py-2">
              <Input
                type="number"
                id="phone"
                isDisabled={!revision}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                label="Nomor Telpon"
              />
            </div>
            <div className="py-2 flex justify-center">
              {revision ?
              <div className="flex gap-2">
                <Button
                isButton
                isPrimary
                  onClick={() => submitData()}
                >
                  Simpan Perubahan
                </Button>
                <Button
                isButton
                isDanger
                onClick={() => setRevision(false)}
                >
                  Batalkan
                </Button>
              </div>
              :
              <Button
                isButton
                isPrimary
                onClick={() => setRevision(true)}
              >
                Ubah Profil
              </Button>
              }
            </div>
          </form>
        </div>
      </div>

      <div className="flex flex-col gap-2 justify-center items-center pb-24 mt-2">
        <InputImage
          file={file}
          setFile={setFile}
          dataImage={dataImage}
          setDataImage={setDataImage}
        />
        <Button
          isPrimary
          isButton
          isLoading={isChangePictureLoading}
          isDisabled={!file}
          title={"Ubah Gambar"}
          onClick={() => submitImage()}
        />
      </div>
    </div>
  );
}
