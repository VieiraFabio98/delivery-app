import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-4">
        <SidebarTrigger />
        <p>Conteúdo da página</p>
      </main>
    </SidebarProvider>
  )
}
