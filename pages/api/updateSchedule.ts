import type { NextApiRequest, NextApiResponse } from "next";
import { put, del, list } from "@vercel/blob";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const listBlobs = await list();

  console.log("called handleScheduleSubmit frontend");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const scheduleBlobUrl = listBlobs.blobs.find((blob) =>
      blob.pathname.endsWith(".json")
    );
    if (!scheduleBlobUrl) {
      return res
        .status(404)
        .json({ error: "Schedule file not found on server" });
    }

    const delBlob = await del(scheduleBlobUrl.url);
    console.log("deleted blob", delBlob);

    const blob = await put(scheduleBlobUrl.pathname, JSON.stringify(req.body), {
      access: "public",
    });

    return res.json(blob);
  } catch (error) {
    console.error("Error updating schedule:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return res
      .status(500)
      .json({ error: `Failed to update schedule, error: ${errorMessage}` });
  }
}
