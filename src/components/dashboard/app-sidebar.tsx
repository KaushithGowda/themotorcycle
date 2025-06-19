'use client'
import * as React from 'react'

import { CiHome } from 'react-icons/ci'
import { MdForum } from 'react-icons/md'
import { FaBlogger } from 'react-icons/fa'
import { FaUser } from 'react-icons/fa'
import { SiOrganicmaps } from 'react-icons/si'
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
import { TiSpanner } from 'react-icons/ti'

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
          title: 'Profile',
          url: '/profile',
          icon: FaUser,
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
        <Link href='/' className='flex items-center gap-1 p-2'>
          <span className='text-base capitalize font-semibold tracking-wide'>
           the garage
          </span>
          <TiSpanner />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => {
                  const isActive =
                    item.url === '/'
                      ? pathname === '/'
                      : pathname.startsWith(item.url)
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
