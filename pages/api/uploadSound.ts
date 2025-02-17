import type { NextApiRequest, NextApiResponse } from "next";
import { put, del, list } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const adminPassword = "1234"; // Replace with your actual admin password

  console.log("called handlesoundSubmit frontend");

  // Ensure the request method is POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check for authentication header
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Get filename from Content-Disposition header
    const contentDisposition = req.headers["content-disposition"];
    if (!contentDisposition) {
      return res
        .status(400)
        .json({ error: "Missing Content-Disposition header" });
    }
    const filenameMatch = contentDisposition.match(/filename="(.+)"/);
    if (!filenameMatch) {
      return res
        .status(400)
        .json({
          error: "Could not extract filename from Content-Disposition header",
        });
    }
    let filename = filenameMatch[1];
    if (!filename.endsWith(".mp3")) {
      filename = filename + ".mp3";
    }

    // Delete existing MP3 files (optional, if you want to replace the existing file)
    const listBlobs = await list();
    const existingMp3 = listBlobs.blobs.find((blob) =>
      blob.pathname.endsWith(".mp3")
    );
    if (existingMp3) {
      await del(existingMp3.url);
      console.log("deleted blob", existingMp3.pathname);
    }
    const contentType = req.headers["content-type"];
    if (!contentType) {
      return res.status(400).json({ error: "Missing Content-Type header" });
    }

    console.log("Content-Type:", contentType);

    if (!contentType.startsWith("audio/mpeg")) {
      return res.status(400).json({ error: "Invalid file type. Expected MP3." });
    }

    const blob = await put(filename, req, {
      access: "public",
      contentType: contentType,
    });

    return res.json(blob);
  } catch (error) {
    console.error("Error uploading sound:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return res
      .status(500)
      .json({ error: `Failed to upload sound, error: ${errorMessage}` });
  }
}
