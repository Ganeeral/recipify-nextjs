import ProfileUser from "@/components/profile/ProfileUser/ProfileUser.tsx";
import ProfileHistory from "@/components/profile/ProfileHistory/ProfileHistory.tsx";

export default function Profile() {
    return (
        <div className="flex px-9 py-5 w-full">
            <div className="flex items-center w-full flex-col md:flex-row top-0 backdrop-invert bg-[#dabf94e6] rounded-[20px] text-[#F9F1E6] h-screen max-h-[620px] py-[60px] px-[50px] gap-10">
                <ProfileUser />
                <ProfileHistory />
            </div>
        </div>
    );
}
