import type { NextApiRequest, NextApiResponse } from "next";
import { list } from "@vercel/blob";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "BLOB_READ_WRITE_TOKEN not found" });
  }

  try {
    const response = await list({ token });
    const scheduleBlobUrl = response.blobs.find(
      (blob) => blob.pathname === "schedule.json"
    )?.downloadUrl;

    if (!scheduleBlobUrl) {
      return res.status(404).json({ error: "schedule.json not found" });
    }

    const scheduleResponse = await fetch(scheduleBlobUrl, {
      headers: { "Content-Type": "application/json" },
    });

    if (!scheduleResponse.ok) {
      return res.status(500).json({
        error: `Error fetching schedule: ${scheduleResponse.status}`,
      });
    }

    const scheduleData = await scheduleResponse.json();
    return res.status(200).json(scheduleData);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
