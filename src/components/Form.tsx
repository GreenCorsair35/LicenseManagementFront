import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
//import { TextField, Button, CircularProgress, Box } from "@mui/material";
import {
  Avatar,
  Button,
  TextField,
  CircularProgress,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Customize primary color
    },
    secondary: {
      main: "#f50057", // Customize secondary color
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Custom font family
  },
});

interface Input {
  route: string;
  method: string;
}

const Form = ({ route, method }: Input) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";
  /*const invName = method === "login" ? "register" : "login";
  const message =
    method === "login"
      ? "Don't have an account? "
      : "Already have an account? ";
  const link = method === "login" ? "/register" : "/login";*/

  const handleSubmit = async (e: any) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if ((method = "login")) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        setForgotPassword(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {name}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="Username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="Password"
            />
            {loading && (
              <Grid container justifyContent="center">
                <CircularProgress />
              </Grid>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {name}
            </Button>
            {forgotPassword && (
              <Grid container justifyContent="center">
                <Typography variant="body2" color="text.secondary">
                  Forgot password?{" "}
                  <a
                    href="mailto:lotfi.haddouche@sonatrach.dz"
                    style={{ textDecoration: "none" }}
                  >
                    contact admin
                  </a>
                </Typography>
              </Grid>
            )}
            {/* <Grid container justifyContent="center">
              <Typography variant="body2" color="text.secondary">
                {message}
                <Link to={link} style={{ textDecoration: "none" }}>
                  {invName}
                </Link>
              </Typography>
            </Grid> */}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    /*<form onSubmit={handleSubmit} className="form-container">
      <Box
        component="section"
        display="flex"
        alignItems="center"
        gap={4}
        my={4}
        p={4}
        sx={{
          width: "50%",
          height: "50%",
          borderRadius: 1,
          border: "2px solid grey",
        }}
      >
        <h1>{name}</h1>
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {loading && <CircularProgress />}
        <Button variant="contained" type="submit">
          {name}
        </Button>
      </Box>
    </form>*/
  );
};

export default Form;
