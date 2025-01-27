import React from 'react';
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from './ui/accordion';
import Link from 'next/link';

export function Roadmap({ data }: { data: any }) {
        if (!data) {
                return <p className="text-muted-foreground">No roadmap selected.</p>; // Fallback message
        }
        const roadmap = JSON.parse(data.roadmap);

        return (
                <>
                        <h3 className="text-3xl font-extrabold">{data.skill_name}</h3>
                        <Accordion type='single' collapsible className='w-2/3 mt-3'>
                                {typeof roadmap === 'object' && roadmap.map((item: any, index: number) => (
                                        <AccordionItem value={index.toString()} className='border px-3'>
                                                <AccordionTrigger>
                                                        <h4 className="">Day {index + 1} ({new Date(item.day).toLocaleString('en-us', {
                                                                day: "2-digit",
                                                                month: "short",
                                                        })})</h4>
                                                </AccordionTrigger>
                                                <AccordionContent className='flex flex-col gap-3'>
                                                        <h3 className='w-fit text-sm bg-primary/20 text-primary px-3 py-1 font-bold rounded-full'>{item.points} points</h3>
                                                        <div className="flex gap-1 text-md">
                                                                <h3 className='font-bold'>Task: </h3>
                                                                {item.task}
                                                        </div>
                                                        <div className="resources flex gap-3">
                                                                {item.resources.map((resource: any) => (
                                                                        <div className="resource flex gap-1 bg-card p-3 rounded-md">
                                                                                <h3 className='font-bold'>Resource: </h3>
                                                                                <Link href={resource.link} className='hover:text-underline'>{resource.name}</Link>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </AccordionContent>
                                        </AccordionItem>
                                ))}
                        </Accordion>
                </>
        );
}

