import { useContext } from "react";
import { ProfileContext } from "../contexts/ProfileContext";

export const useProfile = () => {
  const {state,updateProfileImage, updateProfileData }=useContext(ProfileContext)
  return{
    profileData:state.profileData,
    loading: state.loading,
    error:state.error,
    updateProfileImage,
    updateProfileData,
  }
};
