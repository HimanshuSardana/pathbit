"use client"
import { Dialog, DialogHeader, DialogFooter, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { Settings } from 'lucide-react';
import { ThemeToggleButton } from './theme-toggle';
import { Switch } from '@/components/ui/switch'
import { useTheme } from 'next-themes';

// TODO: Add theme change and password change options
export function SettingsModal() {
        const { theme, setTheme } = useTheme();

        return (
                <Dialog>
                        <DialogTrigger className="w-full">
                                <SidebarMenuButton tooltip={"Settings"}><Settings /> Settings</SidebarMenuButton>
                        </DialogTrigger>
                        <DialogContent>
                                <DialogHeader>Settings</DialogHeader>
                                <ThemeToggleButton />
                                <div className="flex justify-between">
                                        <h3>Dark Theme</h3>
                                        <Switch id="theme" value={(theme == "dark").toString()} onCheckedChange={(e) => setTheme(theme === 'light' ? 'dark' : 'light')} />
                                </div>
                        </DialogContent>
                </Dialog>

        )
}

