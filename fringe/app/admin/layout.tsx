import React from "react";
import {AuthProvider} from "@/contexts/auth-context";

export const metadata = {
    title: "Adelaide Fringe Admin",
    description: "Adelaide Fringe Festival Admin Portal",
};

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}