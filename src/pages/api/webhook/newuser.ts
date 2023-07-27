import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import NewUserSideEffects from "@/utils/NewUserSideEffects";

export const NewUserSideEffectSchema = z.object({
    userID: z.string(),
    email: z.string()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        // validate body
        try {
            const { userID, email } = NewUserSideEffectSchema.parse(req.body);
            await NewUserSideEffects(userID, email);

            // Sending a response indicating success
            res.status(200).json({ message: "New user side effects processed successfully." });
        } catch (error: any) {
            // Sending a response indicating failure or validation errors
            res.status(400).json({ error: error.message });
        }
    } else {
        // Sending a response for unsupported HTTP methods
        res.status(405).end();
    }
}
