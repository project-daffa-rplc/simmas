import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { currentRole, nameUser } from "@/lib/api/helper"
import { IconUser } from "@tabler/icons-react"

export function SiteHeader() {
  const username = nameUser.get()
  const role = currentRole.get()

  return (
    <header className="flex h-max py-[10px] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-max">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">SMKN 1 JENANGAN PONOROGO</h1>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex gap-[20px]">
            <div className="flex justify-center items-center rounded-[10px]">
              <IconUser width={'20px'} height={"20px"}/>
            </div>
            <div className="flex flex-col">
              <h3 className="text-[length:16px] font-semibold">{username}</h3>
              <p className="text-[length:14px]">{role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
