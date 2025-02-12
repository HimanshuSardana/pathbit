import React from 'react'
import { Button } from '@/components/ui/button'

type CommunityCardProps = {
        name: string,
        description: string,
        memberCount: number,
        isJoined: boolean
}

export function CommunityCard({ name, description, memberCount, isJoined }: CommunityCardProps) {
        return (
                <div className="flex flex-col gap-4 p-5 rounded-md bg-accent/40">
                        <div className="flex gap-3 justify-between w-full">
                                <div className="flex flex-col">
                                        <h3 className='font-bold text-lg'>{name}</h3>
                                        <h3 className='text-muted-foreground text-sm'>{memberCount} members</h3>
                                </div>
                                <Button disabled={isJoined} variant={"outline"} className={`bg-inherit font-bold ${isJoined ? 'text-muted-foreground' : 'text-primary'}`}>
                                        {isJoined ? 'Joined' : 'Join'}
                                </Button>
                        </div>
                        <p className='w-full'>{description}</p>
                </div>
        )
}

