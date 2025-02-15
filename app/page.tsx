"use client"
import { motion, useScroll } from 'motion/react'
import { Button } from "@/components/ui/button";
import Image from 'next'
import LoginSchema from '@/schemas/LoginSchema'
import Link from "next/link";
import { ThemeToggleButton } from "@/components/theme-toggle";
import { Lightbulb, FormInput, BicepsFlexed, Presentation } from "lucide-react";

export default function Home() {
        return (
                <>
                        <Navbar />
                        <Hero />
                        <Features />
                        <HowItWorks />
                </>
        );
}

function Navbar() {
        const { scrollYProgress } = useScroll()

        return (
                <motion.div initial={{ opacity: 0, y: -20 }} className="h-32 flex items-center justify-between mx-[10%]" animate={{
                        opacity: 1, y: 0, transition: {
                                duration: 0.5,
                        }
                }}>
                        {/* BRAND */}
                        <h3 className="font-extrabold text-xl"><span className="text-primary">Path</span>bit</h3>

                        {/* LINKS */}
                        <div className="flex gap-3">
                                <ThemeToggleButton />
                                <Button asChild className="font-bold">
                                        <Link href="/register">Get Started</Link>
                                </Button>
                                <Button variant={"secondary"} className="bg-inherit text-primary font-bold" asChild>
                                        <Link href="/login">Log In</Link>
                                </Button>
                        </div>
                </motion.div>
        );
}

function Hero() {
        return (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{
                        opacity: 1, y: 0, transition: {
                                delay: 1
                        }
                }} viewport={{ amount: 1, once: true }} className="h-[calc(90vh-128px)] flex md:flex-row sm:flex-col items-center  mx-[10%] flex gap-5">
                        {/* LEFT */}
                        <div className="left flex flex-[2] md:items-start sm:items-center sm:text-center md:text-left flex-col space-y-3">
                                <Chip />

                                <h3 className="text-5xl font-extrabold">Learn <span className="text-primary">smarter </span> and <span className="text-primary">faster</span></h3>
                                <p className="font-bold text-muted-foreground sm:w-full md:w-2/3">Personalized learning journies, tailored to your experience and schedule.</p>

                                <div className="buttons flex gap-5">
                                        <Button className="font-bold">Get Started</Button>
                                        <Button variant={"secondary"} className="bg-inherit text-primary font-bold">Learn More</Button>
                                </div>
                        </div>

                        {/* RIGHT */}
                        <div className="right flex flex-[1] border">
                                <img src={"/hero-demo.png"} className='' />
                        </div>
                </motion.div>
        )
}

function Chip() {
        return (
                <span className="bg-primary/20  rounded-full text-base text-xs font-bold px-4 text-primary w-fit p-2">Beta version out now!</span>
        )
}

function Features() {
        return (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 1, once: true }} className="mx-[10%] flex flex-col py-16">
                        <div className="flex justify-between flex-col gap-2">
                                <h3 className="xs:text-left md:text-center font-black text-primary text-lg">Why us?</h3>
                                <h3 className="font-black text-5xl xs:text-left md:text-center">A full-fledged Learning tool</h3>
                                <div className="md:w-1/2 md:mx-auto mt-2">
                                        <p className="xs:text-left md:text-center text-muted-foreground ">
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit libero soluta, placeat consequuntur nam neque hic rem omnis. Earum odit ex rerum reprehenderit dolor nulla.
                                        </p>

                                </div>
                        </div>

                        {/* FEATURE CARDS */}
                        <div className="feature-cards flex flex-col justify-around md:mx-auto md:w-2/3 gap-10 mt-10">
                                <div className="row flex xs:flex-col md:flex-row justify-between gap-10">
                                        <Card icon={<FormInput />} title="AI Powered Roadmap Generation" description="Describe your needs, and let Pathbit’s AI create tailored roadmaps in seconds—powered by Gemini." />
                                        <Card icon={<Presentation />} title="Smart Recommendations" description="Our AI curates the top resources for you to keep you on track" />
                                </div>
                                <div className="row flex xs:flex-col md:flex-row justify-between gap-10">
                                        <Card icon={<BicepsFlexed />} title="Daily Quizzes" description="Reinforce what you learn with daily quizzes" />
                                        <Card icon={<Lightbulb />} title="AI Driven Insights" description="See where you lack understanding and improve it" />
                                </div>
                        </div>
                </motion.div>
        )
}

function HowItWorks() {
        return (
                <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#1e293b" fill-opacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" data-darkreader-inline-fill=""></path></svg>
                        <div className="bg-accent">
                                <motion.div className="bg-accent -mt-1" initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 1, once: true }}>
                                        <h3 className="font-black text-5xl text-center">How it <span className='text-primary'>works</span></h3>
                                        <div className="card-row flex gap-2 px-[10%] mt-5">
                                                <div className="card bg-background flex-[1] p-8 rounded-md">
                                                        <h3 className='text-xl font-extrabold'>Step 1</h3>
                                                        <p className='text-md text-muted-foreground'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptatem!</p>
                                                </div>
                                                <div className="card bg-primary/80 flex-[2] p-8 rounded-md">
                                                        <h3 className='text-xl font-extrabold'>Step 2</h3>
                                                        <p className='text-md text-foreground font-bold'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptatem!</p>
                                                </div>
                                                <div className="card"></div>
                                        </div>
                                        <div className="card-row flex gap-2 px-[10%] mt-5">
                                                <div className="card bg-primary/80 flex-[2] p-8 rounded-md">
                                                        <h3 className='text-xl font-extrabold'>Step 3</h3>
                                                        <p className='text-md text-foreground font-bold'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptatem!</p>
                                                </div>
                                                <div className="card bg-background flex-[1] p-8 rounded-md">
                                                        <h3 className='text-xl font-extrabold'>Step 4</h3>
                                                        <p className='text-md text-muted-foreground'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptatem!</p>
                                                </div>
                                                <div className="card"></div>
                                        </div>
                                </motion.div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#1e293b" fill-opacity="1" d="M0,192L48,186.7C96,181,192,171,288,176C384,181,480,203,576,202.7C672,203,768,181,864,165.3C960,149,1056,139,1152,138.7C1248,139,1344,149,1392,154.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" data-darkreader-inline-fill=""></path></svg>

                </>
        )
}

interface CardProps {
        icon: JSX.Element,
        title: string,
        description: string
}

function Card({ icon, title, description }: CardProps) {
        return (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{
                        opacity: 1, y: 0, transition: {
                                delay: 0.5
                        }
                }} viewport={{ amount: 1 }} className="card flex xs:flex-col md:flex-row gap-3 flex-[1] items-start">
                        <div className="bg-primary rounded-md p-3 text-background">
                                {icon}
                        </div>
                        <div className="text-content flex flex-col gap-1">
                                <h3 className="font-bold text-lg">{title}</h3>
                                <p className="text-muted-foreground">{description}</p>
                        </div>
                </motion.div>

        )
}
