import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const filePath = path.join("/tmp", "schedule.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read schedule file" });
    }
    try {
      const schedule = JSON.parse(data);
      res.json(schedule);
    } catch (parseError) {
      res.status(500).json({ error: "Failed to parse schedule file" });
    }
  });
}
