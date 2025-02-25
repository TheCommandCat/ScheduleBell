import React, { useState, useCallback } from "react";
import {
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";

import { Lesson, Schedule } from "../types";

interface SchedulerEditorProps {
  onScheduleChange: (schedule: Schedule) => void;
  initialSchedule?: Schedule;
}

const SchedulerEditor: React.FC<SchedulerEditorProps> = ({
  onScheduleChange,
  initialSchedule = [],
}) => {
  const [lessons, setLessons] = useState<Lesson[]>(initialSchedule);
  const [lessonName, setLessonName] = useState("");
  const [lessonTime, setLessonTime] = useState("");

  const addLesson = useCallback(() => {
    const newLesson: Lesson = {
      id: lessons.length ? lessons[lessons.length - 1].id + 1 : 1,
      name: lessonName,
      time: lessonTime,
    };
    setLessons([...lessons, newLesson]);
    setLessonName("");
    setLessonTime("");
  }, [lessons, lessonName, lessonTime]);

  const removeLesson = useCallback(
    (id: number) => {
      setLessons(lessons.filter((lesson) => lesson.id !== id));
    },
    [lessons]
  );

  const handleScheduleChange = useCallback(() => {
    onScheduleChange(lessons);
  }, [lessons, onScheduleChange]);

  React.useEffect(handleScheduleChange, [lessons]);

  return (
    <Paper style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <TextField
          label="שם שיעור"
          value={lessonName}
          onChange={(e) => setLessonName(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="שעת שיעור"
            format="HH:mm"
            value={lessonTime ? dayjs(lessonTime, "HH:mm") : null}
            onChange={(time) => setLessonTime(time ? time.format("HH:mm") : "")}
          />
        </LocalizationProvider>
        <Button variant="contained" color="primary" onClick={addLesson}>
          Add Lesson
        </Button>
      </div>
      <List>
        {lessons.map((lesson) => (
          <ListItem key={lesson.id}>
            <ListItemText
              primary={lesson.name}
              secondary={`at ${lesson.time}`}
            />
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => removeLesson(lesson.id)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SchedulerEditor;
