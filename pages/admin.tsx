import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from "@mui/material";
import SchedulerEditor from "../components/SchedulerEditor";
import SendIcon from "@mui/icons-material/Send";

const AdminPage: React.FC = () => {
  const [logedin, setLogedin] = useState(false);
  const [password, setPassword] = useState("");
  const [scheduleFile, setScheduleFile] = useState<File | null>(null);
  const [soundFile, setSoundFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleScheduleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setScheduleFile(e.target.files[0]);
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

    const formData = new FormData();
    if (scheduleFile) formData.append("schedule", scheduleFile);
    if (soundFile) formData.append("sound", soundFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Files uploaded successfully");
      } else {
        setMessage("Failed to upload files");
      }
    } catch (error) {
      setMessage("Error uploading files");
    }
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  marginBottom: 2,
                }}
              >
                <Button variant="outlined" onClick={handleDialogOpen}>
                  Edit Schedule
                </Button>

                <Button variant="outlined" component="span">
                  Upload Sound File
                  <input
                    id="sound-file-upload"
                    type="file"
                    onChange={handleSoundFileChange}
                    style={{ display: "none" }}
                  />
                </Button>
                {soundFile && <Typography>{soundFile.name}</Typography>}
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
          <Dialog open={isDialogOpen} onClose={handleDialogClose}>
            <DialogTitle>Edit Schedule</DialogTitle>
            <DialogContent>
              <SchedulerEditor
                onScheduleChange={(schedule) => console.log(schedule)}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleDialogClose}
                color="primary"
                variant="contained"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
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
