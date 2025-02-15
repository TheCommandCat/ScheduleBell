import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const chunks: Buffer[] = [];
  req.on("data", (chunk) => chunks.push(chunk));

  req.on("end", () => {
    const buffer = Buffer.concat(chunks);
    const filePath = path.join("/tmp", `sound.mp3`);

    try {
      fs.writeFileSync(filePath, buffer);
      res.status(200).json({ message: "File uploaded", path: filePath });
    } catch (error) {
      res
        .status(500)
        .json({ message: "File upload error", error: (error as Error).message });
    }
  });
}
