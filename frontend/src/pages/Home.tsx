import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/side-bar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";


export default function Home() {
  return (
    <SidebarProvider>
      <Toaster position="top-center" />
      <AppSidebar />
      <main className="flex-1 p-4">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
