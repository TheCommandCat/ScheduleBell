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
import path from "path";

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

const App: React.FC = async () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [nextAlarm, setNextAlarm] = useState<Alarm | null>(null);
  const [currentTime, setCurrentTime] = useState<string>(getCurrentTime());
  const [lastPlayedAlarm, setLastPlayedAlarm] = useState<string | null>(null);

  const schedule: { [key: string]: string } = await fetch(
    "/api/getSchedule"
  ).then((res) => res.json());

  const getUpcomingAlarms = useCallback(() => {
    return Object.entries(schedule)
      .map(([name, time]) => ({ name, time }))
      .filter(({ time }) => time > currentTime)
      .sort((a, b) => (a.time > b.time ? 1 : -1));
  }, [currentTime]);

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
  }, [getUpcomingAlarms]);

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
        <audio ref={audioRef} src="/sound.mp3" />
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Today's Schedule
        </Typography>
        <List>
          {Object.entries(schedule).map(([name, time]) => (
            <>
              <ListItem
                key={time}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <ListItemText primary={name} secondary={time} />
              </ListItem>{" "}
            </>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default App;
