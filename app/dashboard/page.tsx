import React from 'react'
import { CommunityCard } from '@/components/communities/community_card'
import { Carousel, CarouselItem, CarouselContent, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

function DashboardPage() {

        const communities = [
                {
                        name: "Community 1",
                        description: "Community 1 description",
                        memberCount: 100,
                        isJoined: true
                },
                {
                        name: "Community 2",
                        description: "Community 2 description",
                        isJoined: false,
                        memberCount: 200
                },
                {
                        name: "Community 3",
                        description: "Community 3 description",
                        isJoined: false,
                        memberCount: 300
                },
                {
                        name: "Community 4",
                        description: "Community 4 description",
                        isJoined: true,
                        memberCount: 400
                },
                {
                        name: "Community 5",
                        description: "Community 5 description",
                        isJoined: false,
                        memberCount: 500
                }
        ]

        return (
                <div className='flex flex-col gap-3 w-full px-5 py-3'>
                        <h3 className='font-extrabold text-3xl'>Communities you might like</h3>
                        <div className="flex gap-3">
                                <Carousel
                                        className='w-full mx-auto'
                                        opts={{
                                                align: 'start'
                                        }}>
                                        <CarouselContent>
                                                {
                                                        communities.map((community, index) => (
                                                                <CarouselItem className='sm:basis-1/2 md:basis-1/4'>
                                                                        <CommunityCard
                                                                                key={index}
                                                                                name={community.name}
                                                                                memberCount={community.memberCount}
                                                                                description={community.description}
                                                                                isJoined={community.isJoined} />
                                                                </CarouselItem>
                                                        ))
                                                }
                                        </CarouselContent>
                                        <CarouselPrevious />
                                        <CarouselNext />
                                </Carousel>
                        </div>
                </div>
        )
}

export default DashboardPage 
