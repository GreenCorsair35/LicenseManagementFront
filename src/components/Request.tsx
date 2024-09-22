import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import api from "../api";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const Request = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // A boolean to show/hide delete confirmation dialog
  const [selectedId, setSelectedId] = useState<number | null>(null); // Store the ID of the selected record
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const getRequests = async (limit: number, offset: number) => {
    setLoading(true);

    await api
      .get("/licensemanagementapi/requests/", {
        params: {
          limit,
          offset,
        },
      })
      .then((res) => {
        setRequests(res.data.results);
        setTotalRecords(res.data.count);
      })
      .catch((error) => alert(error))
      .finally(() => {
        setLoading(false);
      });
  };

  // Fetch data when component mounts or page/size changes
  useEffect(() => {
    getRequests(
      paginationModel.pageSize,
      paginationModel.page * paginationModel.pageSize
    );
  }, [paginationModel.page, paginationModel.pageSize]);

  const handleView = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    event.preventDefault();
    navigate(`/view-request/${id}`);
  };

  const handleUpdate = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    event.preventDefault();
    navigate(`/update-request/${id}`);
  };

  const handleConfirmDelete = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (selectedId !== null) {
      await api
        .delete(`/licensemanagementapi/requests/${selectedId}/delete/`)
        .catch((error) => alert(error));

      handleClose(); // Close the dialog after deleting

      getRequests(
        paginationModel.pageSize,
        paginationModel.page * paginationModel.pageSize
      );
    }
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedId(null);
    setOpen(false);
  };

  // Define the columns for the DataGrid
  const columns = [
    {
      field: "usage_reason",
      headerName: "Usage Reason",
      minWidth: 250,
    },
    {
      field: "product_display",
      headerName: "Product",
      minWidth: 200,
    },
    {
      field: "new_product",
      headerName: "New Product",
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => {
        return params.value !== null &&
          params.value !== undefined &&
          params.value !== ""
          ? params.value
          : "N/A";
      },
    },
    {
      field: "status_display",
      headerName: "Status",
      minWidth: 150,
    },
    {
      field: "requested_on",
      headerName: "Requested On",
      minWidth: 200,
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <div>
          <IconButton
            color="primary"
            onClick={(e) => handleView(e, Number(params.id))}
            aria-label="view"
            title="View"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={(e) => handleUpdate(e, Number(params.id))}
            aria-label="edit"
            title="Edit"
          >
            <EditIcon />
          </IconButton>
          {params.row.status === "P" && (
            <IconButton
              color="error"
              onClick={() => handleDelete(Number(params.id))}
              aria-label="delete"
              title="Delete"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <NavBar />
      <Container maxWidth="lg">
        <Box
          sx={{
            width: "100%",
            margin: "auto",
            marginTop: 6,
            position: "relative",
          }}
        >
          <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
            Requests
          </Typography>
          <Paper elevation={3}>
            <DataGrid
              rows={requests}
              getRowId={(request) => request.pk}
              columns={columns}
              rowCount={totalRecords}
              pageSizeOptions={[5, 10, 25]}
              paginationModel={paginationModel}
              paginationMode="server"
              onPaginationModelChange={setPaginationModel}
              loading={loading}
              sx={{
                ".MuiDataGrid-columnHeader": {
                  backgroundColor: "#cfcfcf",
                },
                ".MuiDataGrid-columnHeaderTitle": {
                  fontWeight: "bold",
                },
              }}
            />
          </Paper>
        </Box>
      </Container>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you really want to delete this record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={(e) => handleConfirmDelete(e)}
            autoFocus
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
