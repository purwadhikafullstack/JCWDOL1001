import { useDispatch, useSelector } from "react-redux";
import ProfileCard from "./component.profile.card";
import UploadRecipeButton from "../../../components/UploadRecipeButton";

export default function Profile() {
  const {profile} = useSelector(state=>{
    return {
      profile : state.auth.profile
    }
  })

  return (
    <div className="container py-24">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-4 lg:gap-4">

        <ProfileCard profile={profile}/>
        <div className="col-span-3 bg-red-500 h-screen">Content</div>
      </div>

      <UploadRecipeButton />
    </div>
  )
}
