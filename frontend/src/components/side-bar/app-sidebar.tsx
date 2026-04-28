import * as React from "react"
import { NavLink } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { VersionSwitcher } from "./version-switcher"
import { SearchForm } from "./search-form"
import { useTheme } from "@/hooks/use-theme"
import { Moon, Sun } from "lucide-react"

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Operação",
      url: "#",
      items: [
        {
          title: "Pedidos",
          url: "/pedidos",
          isActive: true,
        },
        {
          title: "Conversas",
          url: "/conversas",
        },
      ],
    },
    {
      title: "Cardápio",
      url: "#",
      items: [
        {
          title: "Produtos",
          url: "/produtos",
        },
        {
          title: "Categorias",
          url: "/categorias",
        },
      ],
    },
    {
      title: "Cadastros",
      url: "#",
      items: [
        {
          title: "Clientes",
          url: "/clientes",
        },
      ],
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme, toggle } = useTheme()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
          />
        <SearchForm />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggle} className="transition-colors duration-200">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === "dark" ? "Modo claro" : "Modo escuro"}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <NavLink to={item.url}>
                      {({ isActive }) => (
                        <SidebarMenuButton
                          isActive={isActive}
                          className="transition-colors duration-200 hover:bg-amber-200! hover:text-black!"
                        >
                          {item.title}
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}