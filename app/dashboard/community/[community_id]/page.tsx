"use client"
import React from 'react'
import { Users } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

function CommunityPage() {
        const [isJoined, setIsJoined] = React.useState(true)

        const posts = [
                {
                        title: 'Community Rules',
                        description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec',
                        author: 'Himanshu Sardana'
                },
                {
                        title: 'Post 2',
                        description: 'Description of post 2',
                        author: 'Himanshu Sardana'
                }
        ]

        const members = [
                "Himanshu Sardana",
                "Arnav Goyal",
                "Tavish Sood",
                "Nitish",
                "Ansh Manchanda"
        ]

        return (
                <div className='w-full flex flex-col gap-5'>
                        <div className="flex justify-between gap-3 items-center">
                                <div className="flex gap-3 items-center">
                                        <div className="community-icon bg-primary rounded-full p-5 text-xl border border-[3px]">
                                                <Users size={32} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                                <h3 className='text-xl font-extrabold'>ML Engg2</h3>
                                                <h3 className='text-muted-foreground font-bold'>2 members</h3>
                                        </div>
                                </div>

                                <Button variant={"ghost"} onClick={() => setIsJoined(!isJoined)} className={`font-bold ${isJoined ? 'text-red-500' : 'text-primary'}`}>{isJoined ? 'Leave' : 'Join'}</Button>
                        </div>
                        <Separator />

                        <Tabs>
                                <div className="flex justify-between">
                                        <TabsList defaultValue="post">
                                                <TabsTrigger value="post">Posts</TabsTrigger>
                                                <TabsTrigger value="members">Members</TabsTrigger>
                                        </TabsList>

                                        <Button><Plus /> New Post</Button>
                                </div>
                                <TabsContent value="post">
                                        <div className="grid xs:grid-cols-1 md:grid-cols-3 gap-3">
                                                {posts.map((post, index) => (
                                                        <div key={index} className="bg-accent/40 p-5 rounded-md flex flex-col gap-2">
                                                                <h3 className='text-xl font-bold'>{post.title}</h3>
                                                                <h4>By <Link className='text-primary' href="/">{post.author}</Link></h4>
                                                                <p className='text-muted-foreground'>{post.description}</p>
                                                        </div>
                                                )
                                                )}
                                        </div>
                                </TabsContent>
                                <TabsContent value="members">
                                        <div className="grid grid-cols-4 gap-3">
                                                {members.map((member, index) => (
                                                        <div className="bg-accent/40 p-5 rounded-md flex gap-3" >
                                                                <h3 className='font-bold'>{member}</h3>
                                                                {index == 0 && <span className='text-primary font-bold'>(Admin)</span>}
                                                        </div>
                                                ))}
                                        </div>
                                </TabsContent>
                        </Tabs>
                </div >
        )
}

export default CommunityPage
