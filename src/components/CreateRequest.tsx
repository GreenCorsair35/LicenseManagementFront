import { useState, useEffect } from "react";
import api from "../api";
import NavBar from "./NavBar";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  TextField,
  Alert,
  AlertTitle,
  IconButton,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

// Define the type for the result object
interface ResultObject {
  [key: string]: string[] | string; // Each field can have an array of strings or a single string
}

// Define allowed severity types
type AlertSeverity = "error" | "warning" | "info" | "success";

const CreateRequest = () => {
  const [user, setUser] = useState("");
  const [usageReason, setUsageReason] = useState("");
  const [license, setLicense] = useState("");
  const [employee, setEmployee] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultObject>({});
  const [show, setShow] = useState(false);
  const [severity, setSeverity] = useState<AlertSeverity>("info");

  // Automatically close the alert after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 10000);
    return () => clearTimeout(timer); // Clear timeout if component unmounts or if alert is closed manually
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    setShow(false);

    api
      .post("/licensemanagementapi/requests/", {
        usage_reason: usageReason,
        license: license,
        employee: employee,
        status: status,
      })
      .then((res: any) => {
        if (res.status === 201) {
          setResult({ successful: "Request created!" });
          setSeverity("success");
        } else {
          setResult({ failure: "failed to create request!" });
          setSeverity("error");
        }
        setShow(true);
      })
      .catch((error: any) => {
        setResult(error.response.data);
        setSeverity("error");
        setShow(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <NavBar />
      {show && (
        <Alert
          severity={severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setShow(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mt: 2 }}
        >
          <AlertTitle>{severity.toUpperCase()}</AlertTitle>
          <ul>
            {Object.entries(result).map(([field, messages]) => (
              <li>
                {field +
                  " : " +
                  (Array.isArray(messages) ? messages.join(" ") : messages)}
              </li>
            ))}
          </ul>
        </Alert>
      )}
      <Box
        component="form"
        onSubmit={handleSubmit}
        maxWidth="sm"
        sx={{
          margin: "auto",
          marginTop: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
        noValidate
        autoComplete="off"
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          Create Request
        </Typography>
        <TextField
          type="text"
          id="user"
          label="User"
          required
          onChange={(e) => setUser(e.target.value)}
          value={user}
          fullWidth
        />
        <TextField
          type="text"
          id="license"
          label="License"
          required
          onChange={(e) => setLicense(e.target.value)}
          value={license}
          fullWidth
        />
        <TextField
          type="text"
          id="employee"
          label="Employee"
          required
          onChange={(e) => setEmployee(e.target.value)}
          value={employee}
          fullWidth
        />
        <TextField
          type="text"
          id="usage_reason"
          label="Usage Reason"
          required
          onChange={(e) => setUsageReason(e.target.value)}
          value={usageReason}
          multiline
          rows={4}
          fullWidth
        />
        <TextField
          type="text"
          id="status"
          label="Status"
          required
          onChange={(e) => setStatus(e.target.value)}
          value={status}
          fullWidth
        />
        {loading && <CircularProgress />}
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          fullWidth
        >
          Submit
        </Button>
      </Box>
    </>
  );
};

export default CreateRequest;
