import React, { useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { FloatingLabelInput } from '@/components/floating-label-input'
import { FloatingLabelTextarea } from '@/components/floating-label-textarea'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import createCommunity from '@/actions/create_community'
import { toast } from 'sonner'

export function NewCommunityDialog({ email }: { email: string }) {
        const [communityName, setCommunityName] = useState('');
        const [description, setDescription] = useState('');



        const handleSubmit = async () => {
                const result = await createCommunity({ name: communityName, description, createdBy: email });
                if (result.success) {
                        toast.success(result.message);
                }
                else {
                        toast.error(result.message);
                }
        };

        return (
                <Dialog>
                        <DialogTrigger asChild>
                                <SidebarMenuButton tooltip={"New Community"}><Plus />New Community</SidebarMenuButton>
                        </DialogTrigger>
                        <DialogContent>
                                <DialogHeader>
                                        <DialogTitle>
                                                Create a new community
                                        </DialogTitle>
                                </DialogHeader>
                                <FloatingLabelInput
                                        label="Community Name"
                                        value={communityName}
                                        onChange={(e) => setCommunityName(e.target.value)}
                                />
                                <FloatingLabelTextarea
                                        label="Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                />
                                <DialogFooter>
                                        <Button className="text-red-500 font-bold" variant={"ghost"}>Close</Button>
                                        <Button className="font-bold" onClick={handleSubmit}>Create</Button>
                                </DialogFooter>
                        </DialogContent>
                </Dialog>

        )
}

