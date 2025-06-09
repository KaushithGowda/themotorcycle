'use client'
import * as React from 'react'

import { CiHome } from 'react-icons/ci'
import { MdForum } from 'react-icons/md'
import { FaBlogger } from 'react-icons/fa'
import { RiSettingsLine } from 'react-icons/ri'
import { SiOrganicmaps } from 'react-icons/si'
import { GiFullMotorcycleHelmet } from 'react-icons/gi'
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
} from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const data = {
  navMain: [
    {
      title: '',
      url: '',
      items: [
        {
          title: 'Home',
          url: '/',
          icon: CiHome,
        },
        {
          title: 'Forum',
          url: '/forum',
          icon: MdForum,
        },
        {
          title: 'Blogs',
          url: '/blogs',
          icon: FaBlogger,
        },
        {
          title: 'Maps',
          url: '/maps',
          icon: SiOrganicmaps,
        },
        {
          title: 'Settings',
          url: '/settings',
          icon: RiSettingsLine,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link href='/' className='flex items-center gap-2 p-3 rounded-lg'>
          <GiFullMotorcycleHelmet />
          <span className='text-base font-semibold tracking-wide'>
            themotorcycle
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => {
                  const isActive = pathname.startsWith(item.url)
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link
                          href={item.url}
                          className='flex items-center gap-2 h-8 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
                        >
                          <item.icon />{' '}
                          <span className='truncate'>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
