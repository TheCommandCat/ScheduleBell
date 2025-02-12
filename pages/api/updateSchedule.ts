import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const adminPassword = "1234"; // Replace with your actual admin password

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const schedule = req.body;

    console.log(schedule);

    fs.writeFileSync("./public/schedule.json", schedule);

    res.status(200).json({ message: "Schedule updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to update schedule, error: ${error}` });
  }
}
