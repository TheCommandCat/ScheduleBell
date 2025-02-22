import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return res.status(500).json({ message: "ADMIN_PASSWORD not set" });
    }

    if (password === adminPassword) {
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } else {
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
