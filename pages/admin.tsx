import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import HomeIcon from "@mui/icons-material/Home";
import SchedulerEditor from "../components/SchedulerEditor";
import { Schedule } from "@/types";

const AdminPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logedin, setLogedin] = useState(false);
  const [password, setPassword] = useState("");
  const [soundFile, setSoundFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [schedule, setSchedule] = useState<Schedule>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch("/api/getSchedule");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSchedule(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching schedule:", error);
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        setLogedin(true);
        setMessage("");
      } else {
        const data = await response.json();
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Login Error");
    }
  };

  const handleSoundFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSoundFile(e.target.files[0]);
    }
  };

  const handleRemoveSoundFile = () => {
    setSoundFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleScheduleSubmit = async (schedule: Schedule) => {
    try {
      const response = await fetch("/api/updateSchedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify(schedule),
      });

      setMessage(
        response.ok
          ? "Schedule updated successfully"
          : "Failed to update schedule"
      );
    } catch (error) {
      console.error("Error submitting schedule: ", error);
    }
  };

  const handleAudioUpload = async () => {
    if (!soundFile) {
      setMessage("Please select a sound file to upload");
      return;
    }

    try {
      const response = await fetch("/api/uploadSound", {
        method: "POST",
        headers: {
          "Content-Disposition": `form-data; name="soundFile"; filename="${soundFile.name}"`,
          "Content-Type": soundFile.type,
          Authorization: `Bearer ${password}`,
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

  const handleSubmit = async () => {
    if (!logedin) {
      setMessage("You must be logged in to upload files");
      return;
    }

    if (Object.keys(schedule).length > 0) {
      await handleScheduleSubmit(schedule);
    }

    await handleAudioUpload();
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, position: "relative" }}>
        <Link href="/">
          <IconButton
            color="default"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              mt: 2,
              mr: 2,
            }}
          >
            <HomeIcon />
          </IconButton>
        </Link>
        {logedin ? (
          <>
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <SchedulerEditor
                  onScheduleChange={(newSchedule) => setSchedule(newSchedule)}
                  initialSchedule={schedule}
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
          </>
        ) : (
          <>
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
          </>
        )}
      </Paper>
    </Container>
  );
};

export default AdminPage;
