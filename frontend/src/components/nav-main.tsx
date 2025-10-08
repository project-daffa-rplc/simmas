import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    description: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const location = useLocation()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem  className="!mt-[10px] !h-max" key={item.title}>
              <SidebarMenuButton className="!h-max !px-[15px] !py-[20px]" tooltip={item.title} isActive={item.url == location.pathname}>
                <div className="w-max flex justify-center items-center rounded-[5px] p-[8px] hover::bg-(--color-nav-box)">
                  {item.icon && <item.icon />}
                </div>
                <div>
                  <h3 className=" font-semibold text-[length:14px]">{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
