import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Typography } from "@mui/material";
import NavBar from "./NavBar";

// Define the columns for the DataGrid
const columns = [
  { field: "usage_reason", headerName: "Usage Reason", width: 500 },
  { field: "license", headerName: "License", width: 150 },
  { field: "employee", headerName: "Employee", width: 150 },
  { field: "status", headerName: "Status", width: 100 },
  { field: "requested_on", headerName: "Requested On", width: 150 },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    renderCell: (params) => (
      <div>
        <IconButton
          color="primary"
          onClick={() => handleView(params.pk)}
          aria-label="view"
          title="View"
        >
          <VisibilityIcon />
        </IconButton>
        <IconButton
          color="secondary"
          onClick={() => handleUpdate(params.pk)}
          aria-label="edit"
          title="Edit"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          color="error"
          onClick={() => handleDelete(params.pk)}
          aria-label="delete"
          title="Delete"
        >
          <DeleteIcon />
        </IconButton>
      </div>
    ),
  },
];

const Request = ({ requests }) => {
  return (
    <>
      <NavBar />
      <Box
        sx={{
          marginTop: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          Requests
        </Typography>
        <DataGrid
          rows={requests}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          getRowId={(row) => row.pk}
        />
      </Box>
    </>
    /*<div className="request-container">
      <p className="request-usageReason">{request.usage_reason}</p>
      <p className="request-status">{request.status}</p>
      <button className="delete-button" onClick={() => onDelete(request.pk)}>
        Delete
      </button>
    </div>*/
  );
};

export default Request;
