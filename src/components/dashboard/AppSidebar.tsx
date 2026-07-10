import {
  FileText,
  Folder,
  Home,
  Image as ImageIcon,
  LogOut,
  Rss,
  Settings,
  Tag,
  Users,
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import logo from "@/assets/images/admin-logo.png"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getStoredUser, logout } from "@/lib/auth"

const contentNav = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Posts", url: "/posts", icon: FileText },
  { title: "Categories", url: "/categories", icon: Folder },
  { title: "Tags", url: "/tags", icon: Tag },
  { title: "Media Library", url: "/media-library", icon: ImageIcon },
  { title: "Authors", url: "/users", icon: Users, adminOnly: true },
]

const settingsNav = [
  { title: "SEO Settings", url: "/seo-settings", icon: Rss },
  { title: "General Settings", url: "/general-settings", icon: Settings },
]

function isNavItemActive(pathname: string, url: string) {
  return pathname === url || pathname.startsWith(`${url}/`)
}

function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = getStoredUser()
  const isAdmin = user?.__t === "admin"

  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Account"
    : "Account"
  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "?"

  const handleLogout = () => {
    logout()
    toast.success("Signed out")
    navigate("/login")
  }

  return (
    <Sidebar className="border-r border-[#DFDFDF] bg-white text-[#161616]">
      <SidebarHeader className="items-center gap-3 px-4 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="CVJury" className="h-10 w-auto" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold tracking-wide text-[#9A9A9A] uppercase">
            Content
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentNav
                .filter((item) => !item.adminOnly || isAdmin)
                .map((item) => {
                  const isActive = isNavItemActive(
                    location.pathname,
                    item.url
                  )
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="h-10 rounded-lg text-[#4A4A4A] data-active:bg-[#E97451] data-active:text-white data-active:hover:bg-[#E97451] data-active:hover:text-white"
                      >
                        <Link to={item.url}>
                          <item.icon className="size-5!" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] font-semibold tracking-wide text-[#9A9A9A] uppercase">
              Settings
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsNav.map((item) => {
                  const isActive = isNavItemActive(
                    location.pathname,
                    item.url
                  )
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="h-10 rounded-lg text-[#4A4A4A] data-active:bg-[#E97451] data-active:text-white data-active:hover:bg-[#E97451] data-active:hover:text-white"
                      >
                        <Link to={item.url}>
                          <item.icon className="size-5!" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-[#E8E8EC] px-4 py-4">
        <div className="flex items-center gap-2.5">
          <Link to="/profile" className="flex min-w-0 flex-1 items-center gap-2.5">
            <Avatar>
              {user?.profileImage ? (
                <AvatarImage src={user.profileImage} alt="" />
              ) : null}
              <AvatarFallback className="bg-[#F1F1F3] font-medium text-[#4A4A4A]">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#161616]">
                {displayName}
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#8C8C8C] hover:bg-[#F1F1F3] hover:text-[#4A4A4A]"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export { AppSidebar }
