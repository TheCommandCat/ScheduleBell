import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";

interface Lesson {
  id: number;
  name: string;
  time: string;
}

interface SchedulerEditorProps {
  onScheduleChange: (schedule: { [key: string]: string }) => void;
}

const SchedulerEditor: React.FC<SchedulerEditorProps> = ({
  onScheduleChange,
}) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonName, setLessonName] = useState("");
  const [lessonTime, setLessonTime] = useState("");

  const addLesson = () => {
    const newLesson: Lesson = {
      id: lessons.length ? lessons[lessons.length - 1].id + 1 : 1,
      name: lessonName,
      time: lessonTime,
    };
    const updatedLessons = [...lessons, newLesson];
    setLessons(updatedLessons);

    // Converting lessons array to schedule object
    const schedule: { [key: string]: string } = {};
    updatedLessons.forEach((lesson) => {
      schedule[lesson.name] = lesson.time;
    });

    onScheduleChange(schedule); // Pass the schedule to the parent component
  };

  const removeLesson = (id: number) => {
    const updatedLessons = lessons.filter((lesson) => lesson.id !== id);
    setLessons(updatedLessons);

    // Converting lessons array to schedule object
    const schedule: { [key: string]: string } = {};
    updatedLessons.forEach((lesson) => {
      schedule[lesson.name] = lesson.time;
    });

    onScheduleChange(schedule); // Pass the updated schedule to the parent component
  };

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
            onChange={(time) => time && setLessonTime(time.format("HH:mm"))}
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
