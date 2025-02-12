"use server"
import { createClient } from "@/utils/supabase/server";

type CommunityInfo = {
        name: string;
        description: string;
        createdBy: string;
};

export default async function createCommunity({ name, description, createdBy }: CommunityInfo) {
        const client = await createClient(); // No need to await here

        // Insert into communities and return the ID of the inserted community
        const { data, error } = await client
                .from("communities")
                .insert([{ name, description, created_by: createdBy }])
                .select("community_id") // Ensure we retrieve the ID
                .single(); // Get a single row instead of an array

        if (error) {
                return { success: false, message: error.message };
        }

        if (!data) {
                return { success: false, message: "Failed to create community." };
        }

        // Insert into community_members to add the creator as a member
        const { error: memberError } = await client
                .from("community_members")
                .insert([{ community_id: data['community_id'], email: createdBy }]); // Assuming 'owner' role

        if (memberError) {
                return { success: false, message: memberError.message };
        }

        return { success: true, message: "Community created successfully" };
}
