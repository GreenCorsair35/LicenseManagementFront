import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import NavBar from "./NavBar";
import { Box, TextField, Typography, Button } from "@mui/material";

const ViewRequest = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [usageReason, setUsageReason] = useState("");
  const [license, setLicense] = useState("");
  const [employee, setEmployee] = useState("");
  const [status, setStatus] = useState("");

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getRequest();
  }, []);

  const getRequest = () => {
    api
      .get(`/licensemanagementapi/requests/${id}/`)
      .then((res) => {
        setUser(res.data.owner.username ? res.data.owner.username : "");
        setUsageReason(res.data.usage_reason ? res.data.usage_reason : "");
        setLicense(res.data.license ? res.data.license.license_key : "");
        setEmployee(
          res.data.employee
            ? res.data.employee.last_name + " " + res.data.employee.first_name
            : ""
        );
        setStatus(res.data.status_display ? res.data.status_display : "");
      })
      .catch((error) => alert(error));
  };

  const goBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(-1); // Go back to the previous page
  };

  return (
    <>
      <NavBar />
      <Box
        component="form"
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
          View Request
        </Typography>
        <TextField
          type="text"
          id="user"
          label="User"
          required
          value={user}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
        <TextField
          type="text"
          id="license"
          label="License"
          required
          value={license}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
        <TextField
          type="text"
          id="employee"
          label="Employee"
          required
          value={employee}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
        <TextField
          type="text"
          id="usage_reason"
          label="Usage Reason"
          required
          value={usageReason}
          multiline
          rows={4}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
        <TextField
          type="text"
          id="status"
          label="Status"
          required
          value={status}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={(e) => goBack(e)}
          fullWidth
        >
          Back
        </Button>
      </Box>
    </>
  );
};

export default ViewRequest;
