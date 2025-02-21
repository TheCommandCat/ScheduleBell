import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import {
  Button,
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Card,
  Link,
  IconButton,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { fetchScheduleData } from "@/lib/utils/fetchServerData";

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
  const lastPlayedAlarmRef = useRef<string | null>(null);

  const scheduleEntries = useMemo(() => Object.entries(schedule), [schedule]);

  useEffect(() => {
    const updateClock = () => {
      const time = getCurrentTime();

      const upcomingAlarms = scheduleEntries
        .map(([name, alarmTime]) => ({ name, time: alarmTime }))
        .filter(({ time: alarmTime }) => alarmTime > time)
        .sort((a, b) => Number(a.time) - Number(b.time));

      setNextAlarm(upcomingAlarms.length > 0 ? upcomingAlarms[0] : null);

      if (
        schedule &&
        Object.values(schedule).includes(time) &&
        audioRef.current &&
        lastPlayedAlarmRef.current !== time
      ) {
        audioRef.current.play();
        lastPlayedAlarmRef.current = time;
      }
    };

    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [schedule]);

  return (
    <Container maxWidth="sm" dir="rtl">
      <Paper
        elevation={4}
        sx={{ p: 4, mt: 4, textAlign: "center", position: "relative" }}
      >
        <Link href="/admin">
          <IconButton
            color="default"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Link>
        <Typography variant="h4" gutterBottom>
          מערכת צלצולים
        </Typography>
        <Card elevation={2} sx={{ mb: 3, p: 2 }}>
          <Typography variant="body1" color="textSecondary">
            הצלצול הבא:
          </Typography>
          <Typography
            variant="h5"
            color={nextAlarm ? "primary" : "textSecondary"}
          >
            {nextAlarm
              ? `${nextAlarm.name} - ${nextAlarm.time}`
              : "אין צלצולים מתוזמנים"}
          </Typography>
        </Card>
        <Button variant="contained" onClick={() => audioRef.current?.play()}>
          בדיקת צלצול
        </Button>
        <audio ref={audioRef} src={mp3Url} />
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          לוח הזמנים
        </Typography>
        <List>
          {scheduleEntries.map(([name, time]) => (
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
  const { schedule, mp3Url } = await fetchScheduleData();
  return { props: { schedule, mp3Url } };
};

export default App;
