import "@/app/globals.css";
import Image from "next/image";


export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div id="page" className="relative">
            {children}
        </div>
    );
}
