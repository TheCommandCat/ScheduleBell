import { list } from "@vercel/blob";

export const fetchScheduleData = async () => {
  try {
    const response = await list();
    const scheduleBlobUrl = response.blobs.find(
      (blob) => blob.pathname === "schedule.json"
    )?.downloadUrl;
    const mp3BlobUrl = response.blobs.find((blob) =>
      blob.pathname.endsWith(".mp3")
    )?.downloadUrl;

    if (!scheduleBlobUrl) return { schedule: {}, mp3Url: mp3BlobUrl || null };

    const scheduleResponse = await fetch(scheduleBlobUrl, {
      headers: { "Content-Type": "application/json" },
    });

    const scheduleData = scheduleResponse.ok
      ? await scheduleResponse.json()
      : {};

    return { schedule: scheduleData, mp3Url: mp3BlobUrl || null };
  } catch (error) {
    console.error("Error fetching schedule or mp3 data:", error);
    return { schedule: {}, mp3Url: null };
  }
};
