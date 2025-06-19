import ProfileUser from "@/components/profile/ProfileUser/ProfileUser.tsx";
import ProfileTabs from "./ProfileTabs/ProfileTabs";

export default function Profile() {
  return (
    <div className="flex px-9 py-5 w-full h-full">
      <div className="flex items-center w-full flex-col md:flex-row top-0 backdrop-invert bg-[#dabf94e6] rounded-[20px] text-[#F9F1E6] h-screen max-h-[620px] py-[60px] px-[50px] gap-10">
        <ProfileUser />
        <div className="justify-center hidden md:block w-2 bg-[#3F1D11] h-full rounded-md"></div>
        <ProfileTabs />
      </div>
    </div>
  );
}
