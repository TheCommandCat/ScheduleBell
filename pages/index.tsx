import { useRef, useState, useEffect, useCallback } from "react";
import {
  Button,
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Card,
} from "@mui/material";
import { list } from "@vercel/blob";

interface Alarm {
  name: string;
  time: string;
}

const getCurrentTime = (): string => {
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const App: React.FC<{ schedule: Record<string, string>; mp3Url: string }> = ({
  schedule,
  mp3Url,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [nextAlarm, setNextAlarm] = useState<Alarm | null>(null);
  const [currentTime, setCurrentTime] = useState<string>(getCurrentTime());
  const [lastPlayedAlarm, setLastPlayedAlarm] = useState<string | null>(null);

  console.log("mp3Url", mp3Url);

  const getUpcomingAlarms = useCallback(() => {
    return Object.entries(schedule)
      .map(([name, time]) => ({ name, time }))
      .filter(({ time }) => time > currentTime)
      .sort((a, b) => (a.time > b.time ? 1 : -1));
  }, [currentTime, schedule]);

  useEffect(() => {
    const updateClock = () => {
      const time = getCurrentTime();
      setCurrentTime(time);
      const upcomingAlarms = getUpcomingAlarms();
      setNextAlarm(upcomingAlarms.length > 0 ? upcomingAlarms[0] : null);

      if (
        schedule &&
        Object.values(schedule).includes(time) &&
        audioRef.current &&
        lastPlayedAlarm !== time
      ) {
        audioRef.current.play();
        setLastPlayedAlarm(time);
      }
    };

    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [getUpcomingAlarms, schedule, lastPlayedAlarm]);

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ p: 4, mt: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Hofim Alarm System
        </Typography>
        <Card elevation={2} sx={{ mb: 3, p: 2 }}>
          <Typography variant="body1" color="textSecondary">
            Next Alarm:
          </Typography>
          <Typography
            variant="h5"
            color={nextAlarm ? "primary" : "textSecondary"}
          >
            {nextAlarm
              ? `${nextAlarm.name} - ${nextAlarm.time}`
              : "No upcoming alarms"}
          </Typography>
        </Card>
        <Button variant="contained" onClick={() => audioRef.current?.play()}>
          Test Alarm
        </Button>
        <audio ref={audioRef} src={mp3Url} />
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Today's Schedule
        </Typography>
        <List>
          {Object.entries(schedule).map(([name, time]) => (
            <ListItem
              key={time}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <ListItemText primary={name} secondary={time} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export const getServerSideProps = async () => {
  try {
    const response = await list();

    // Find the download URL for the schedule.json file
    const scheduleBlobUrl = response.blobs.find(
      (blob) => blob.pathname === "schedule.json"
    )?.downloadUrl;

    // Find the download URL for the .mp3 file
    const mp3BlobUrl = response.blobs.find((blob) =>
      blob.pathname.endsWith(".mp3")
    )?.downloadUrl;

    // If no schedule.json file is found, return empty schedule
    if (!scheduleBlobUrl) {
      return { props: { schedule: {}, mp3Url: null } };
    }

    // Fetch the schedule data
    const scheduleResponse = await fetch(scheduleBlobUrl, {
      headers: { "Content-Type": "application/json" },
    });

    // If the schedule response is not OK, return empty schedule
    if (!scheduleResponse.ok) {
      return { props: { schedule: {}, mp3Url: mp3BlobUrl || null } };
    }

    // Parse the response JSON
    const scheduleData = await scheduleResponse.json();

    // Return the schedule and mp3Url in the props
    return { props: { schedule: scheduleData, mp3Url: mp3BlobUrl || null } };
  } catch (error) {
    console.error("Error fetching schedule or mp3 data:", error);
    return { props: { schedule: {}, mp3Url: null } };
  }
};

export default App;
