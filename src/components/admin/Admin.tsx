import AdminUsers from "@/components/admin/AdminUsers/AdminUsers.tsx";

export default function Admin() {
    return (
        <div className="flex px-9 py-5 w-full">
            <div className="flex justify-center items-center top-0 blur__banner backdrop-opacity-10 backdrop-invert bg-[#DABF94]/35 rounded-[20px] text-[#F9F1E6] w-full min-w-[1150px] h-screen max-h-[600px] py-[60px] px-[90px] gap-64">
                <AdminUsers />
            </div>
        </div>
    );
}
