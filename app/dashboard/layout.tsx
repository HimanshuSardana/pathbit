"use client";
import ProtectedRoute from "@/components/auth/protected-route-wrapper";
import useCurrentUser from "@/hooks/useCurrentUser";
import logout from "@/actions/logout";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
        const { user, loading } = useCurrentUser(); // Ensure proper type for 'user' (optional chaining or proper types for user fields)
        const initials = user?.user_metadata?.name?.split(" ").map((name: string) => name.charAt(0).toUpperCase()).join("") ?? "";
        const path = usePathname();
        const email = user?.email ?? "No email"; // Safe fallback
        const breadcrumbs = path.split("/").map((path) => path.charAt(0).toUpperCase() + path.slice(1)).slice(1);

        return (
                <ProtectedRoute user={user} loading={loading}>
                        <main className="w-full">
                                {children}
                        </main>
                </ProtectedRoute>
        );
}

