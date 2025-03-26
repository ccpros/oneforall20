// pages/api/submit-to-sanity.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_WRITE_TOKEN!, // Must have write access
  useCdn: false,
  apiVersion: "2023-01-01",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const data = req.body;

  try {
    const doc = await client.create({
      _type: "complaint",
      ...data,
    });

    return res.status(200).json({ success: true, id: doc._id });
  } catch (err) {
    console.error("Sanity error:", err);
    return res.status(500).json({ success: false, message: "Sanity submission failed" });
  }
}
