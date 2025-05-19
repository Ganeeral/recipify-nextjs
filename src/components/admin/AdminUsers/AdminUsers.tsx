import React from "react";

const AdminUsers = () => {
    return (
        <div className="flex flex-col h-full relative">
            <div className="flex flex-col mt-[30px]">
                <div className="flex w-full justify-between items-center">
                    <h2 className="text-black text-[45px] font-['ArsenalB']">Список пользователей</h2>
                    <form className="font-['ArsenalR'] text-[#DABF94]">
                        <div className="flex justify-center items-center relative w-full max-w-lg">
                            <input
                                type="search"
                                placeholder="найти"
                                className="flex justify-between items-center bg-[#DABF94]/25 backdrop-blur-3xl backdrop-opacity-10 backdrop-invert rounded-[30px] py-2 px-3 w-full max-w-[200px] text-[12px] font-['ArsenalR'] outline-none focus:ring-2 focus:ring-[#DABF94] placeholder-white placeholder-opacity-[60%]"
                            />
                            <img
                                src="/search.png"
                                alt="Поиск"
                                className="absolute left-[87%] top-1/2 transform -translate-y-1/2 w-3 h-3"
                            />
                        </div>
                    </form>
                </div>
                <div className="flex flex-col rounded-[30px] w-full h-full max-h-[350px] min-w-[950px] p-[30px] my-3">
                    <div className="overflow-auto scrollbar-custom">
                        <table className="w-full text-left table-auto">
                            <thead>
                                <tr className="text-black text-[15px] font-['ArsenalB']">
                                    <th className="px-4 py-2">ID</th>
                                    <th className="px-4 py-2">Email</th>
                                    <th className="px-4 py-2  flex justify-end">Ban/Unban</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-black bg-[#DABF94]/35  hover:bg-[#DABF94]/60 w-full h-full max-h-[350px] min-w-[950px] p-[30px] my-3">
                                    <td className="px-4 py-2">1</td>
                                    <td className="px-4 py-2">user@example.com</td>
                                    <td className="px-4 py-2 flex justify-end">
                                        <button className="bg-[#6e2121] text-white px-3 py-1 rounded hover:bg-[#782c2c]">
                                            Ban
                                        </button>
                                        {/* <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                                            Unban
                                        </button> */}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            <div className="bottom-2 w-full absolute max-w-[280px] hidden mobile-xs:block h-1 bg-[#3F1D11] rounded-md"></div>
        </div>
    );
}

export default AdminUsers 
