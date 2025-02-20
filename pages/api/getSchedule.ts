import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const blobUrl =
    "https://jpgmakypmimtlyqi.public.blob.vercel-storage.com/schedule-MHJZQSKB6jWGnOmK5KxIKAlWKU9xCo.json";

  try {
    const response = await fetch(blobUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch schedule file");
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
}
