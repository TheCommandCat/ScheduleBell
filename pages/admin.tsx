import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  DialogTitle,
} from "@mui/material";
import SchedulerEditor from "../components/SchedulerEditor";
import SendIcon from "@mui/icons-material/Send";

const AdminPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logedin, setLogedin] = useState(false);
  const [password, setPassword] = useState("");
  const [scheduleFile, setScheduleFile] = useState<File | null>(null);
  const [soundFile, setSoundFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [schedule, setSchedule] = useState<{ [key: string]: string }>({});
  const [initialSchedule, setInitialSchedule] = useState<{
    [key: string]: string;
  }>({});

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleScheduleSubmit = async (schedule: { [key: string]: string }) => {
    console.log("called handleScheduleSubmit frontend");

    try {
      const response = await fetch("/api/updateSchedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 1234",
        },
        body: JSON.stringify(schedule),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Schedule updated successfully");
      } else {
        const error = await response.json();
        console.error("Failed to update schedule:", error.error);
      }
    } catch (error) {
      console.error("Error submitting schedule:", error);
    }
  };

  const fetchInitialSchedule = async () => {
    try {
      const response = await fetch("/api/getSchedule");
      if (response.ok) {
        const data = await response.json();
        setInitialSchedule(data);
        setSchedule(data); // Initialize current schedule with initial data
      } else {
        console.error("Failed to fetch initial schedule");
      }
    } catch (error) {
      console.error("Error fetching initial schedule:", error);
    }
  };

  useEffect(() => {
    if (logedin) {
      fetchInitialSchedule();
    }
  }, [logedin]);

  const handleRemoveSoundFile = () => {
    setSoundFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSoundFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSoundFile(e.target.files[0]);
    }
  };

  const handleLogin = () => {
    if (password === "1234") {
      setLogedin(true);
      setMessage("");
    } else {
      setMessage("Incorrect password");
    }
  };

  const handleSubmit = async () => {
    if (!logedin) {
      setMessage("You must be logged in to upload files");
      return;
    }

    if (Object.keys(schedule).length > 0) {
      handleScheduleSubmit(schedule);
    }

    if (!soundFile) {
      setMessage("Please select a sound file to upload or update the schedule");
      return;
    }

    try {
      const response = await fetch("/api/uploadSound", {
        method: "POST",
        headers: {
          "Content-Disposition": `form-data; name="soundFile"; filename="${soundFile.name}"`,
          "Content-Type": soundFile.type,
          Authorization: "Bearer 1234",
        },
        body: soundFile,
      });

      if (response.ok) {
        const result = await response.json();
        setMessage("Files updated successfully");
        console.log("Sound file uploaded successfully:", result);
      } else {
        const error = await response.json();
        setMessage("Failed to upload sound file");
        console.error("Failed to upload sound file:", error.error);
      }
    } catch (error) {
      setMessage("Error uploading sound file");
      console.error("Error uploading sound file:", error);
    }
  };

  return (
    <>
      {logedin ? (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                marginBottom: 2,
                color: "primary",
                fontWeight: "bold",
              }}
            >
              מערכת מנהל
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {/* Column layout for Schedule Editor and Upload */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <DialogTitle>Edit Schedule</DialogTitle>
                <SchedulerEditor
                  onScheduleChange={(newSchedule) => setSchedule(newSchedule)}
                />

                <Button
                  variant="outlined"
                  component="span"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Sound File
                  <input
                    ref={fileInputRef}
                    id="sound-file-upload"
                    type="file"
                    onChange={handleSoundFileChange}
                    style={{ display: "none" }}
                  />
                </Button>
                {soundFile && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography>{soundFile.name}</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleRemoveSoundFile}
                    >
                      Remove
                    </Button>
                  </Box>
                )}
              </Box>
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleSubmit}
              >
                Update Files
              </Button>
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{
                  textAlign: "center",
                  marginTop: 2,
                }}
              >
                {message}
              </Typography>
            </Box>
          </Paper>
        </Container>
      ) : (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
              מערכת מנהל
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              type="password"
              label="Password"
              value={password}
              onChange={handlePasswordChange}
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleLogin}
              sx={{ marginBottom: 2 }}
            >
              Login
            </Button>
            <Typography variant="body1" color="textSecondary">
              {message}
            </Typography>
          </Paper>
        </Container>
      )}
    </>
  );
};

export default AdminPage;
