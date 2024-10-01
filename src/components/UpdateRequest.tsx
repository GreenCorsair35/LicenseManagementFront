import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import NavBar from "./NavBar";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import {
  Box,
  TextField,
  Autocomplete,
  Alert,
  AlertTitle,
  IconButton,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTranslation } from "react-i18next";

// Define the type for the result object
interface ResultObject {
  [key: string]: string[] | string; // Each field can have an array of strings or a single string
}

interface productObject {
  product_id: Number;
  product_name: string;
  version: string;
  vendor: string;
  description: string;
}

// Define allowed severity types
type AlertSeverity = "error" | "warning" | "info" | "success";

const UpdateRequest = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [usageReason, setUsageReason] = useState("");
  const [product, setProduct] = useState<productObject | null>(null);
  const [newProduct, setNewProduct] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultObject>({});
  const [show, setShow] = useState(false);
  const [severity, setSeverity] = useState<AlertSeverity>("info");

  const { id } = useParams<{ id: string }>();

  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingCB, setLoadingCB] = useState(false);
  const [options, setOptions] = useState([]);

  // Automatically close the alert after 5 seconds
  useEffect(() => {
    getRequest();

    const timer = setTimeout(() => {
      setShow(false);
    }, 10000);
    return () => clearTimeout(timer); // Clear timeout if component unmounts or if alert is closed manually
  }, []);

  const getRequest = () => {
    api
      .get(`/licensemanagementapi/requests/${id}/`)
      .then((res) => {
        setUsageReason(res.data.usage_reason ? res.data.usage_reason : "-");
        if (res.data.product) {
          api
            .get(`/licensemanagementapi/products/${res.data.product}/`)
            .then((res) => {
              setProduct(res.data ? res.data : null);
            })
            .catch((error) => alert(error));
        }
        setNewProduct(res.data.new_product ? res.data.new_product : "-");
        setStatus(res.data.status ? res.data.status : "");
      })
      .catch((error) => alert(error));
  };

  const handleUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    e.preventDefault();
    setShow(false);

    if (status !== "P") {
      setResult({
        failure: t("requestUpdateImpossible"),
      });
      setSeverity("error");
      setShow(true);
      setLoading(false);
    } else {
      api
        .patch(`/licensemanagementapi/requests/${id}/update/`, {
          product: product ? product.product_id : null,
          new_product: newProduct,
          usage_reason: usageReason,
        })
        .then((res: any) => {
          if (res.status === 200 || res.status === 201) {
            setResult({ successful: t("requestUpdateSuccess") });
            setSeverity("success");
          } else {
            setResult({ failure: t("requestUpdateError") });
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
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    e.preventDefault();
    setShow(false);

    if (status === "O") {
      api
        .patch(`/licensemanagementapi/requests/${id}/update/`, {
          status: "C",
        })
        .then((res: any) => {
          if (res.status === 200 || res.status === 201) {
            setResult({ successful: t("requestCancelSuccess") });
            setSeverity("success");
            getRequest();
          } else {
            setResult({ failure: t("requestCancelError") });
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
    } else {
      setResult({
        failure: t("requestCancelImpossible"),
      });
      setSeverity("error");
      setShow(true);
      setLoading(false);
    }

    setOpenDialog(false);
  };

  const goBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(-1); // Go back to the previous page
  };

  // Fetch products from server
  const fetchProducts = async () => {
    setLoadingCB(true);

    await api
      .get("/licensemanagementapi/products/?limit=10000")
      .then((res) => {
        setOptions(res.data.results);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
      })
      .finally(() => {
        setLoadingCB(false);
      });
  };

  const handleOpen = () => {
    setOpen(true);
    if (options.length === 0) {
      fetchProducts();
    }
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
              <li key={field}>
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
        maxWidth="sm"
        sx={{
          margin: "auto",
          marginTop: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
        autoComplete="off"
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          {t("updateRequest")}
        </Typography>
        <Autocomplete
          value={product}
          disabled={status !== "P"}
          onChange={(_event, newValue) => setProduct(newValue)}
          open={open}
          onOpen={handleOpen}
          onClose={() => setOpen(false)}
          isOptionEqualToValue={(option, value) =>
            option.product_name === value.product_name
          }
          getOptionLabel={(option) => option.product_name}
          options={options}
          loading={loadingCB}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("product")}
              required
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingCB ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          fullWidth
        />
        {product?.product_id === 8 && (
          <TextField
            type="text"
            id="new_prodct"
            label={t("newProduct")}
            required
            onChange={(e) => setNewProduct(e.target.value)}
            value={newProduct}
            disabled={status !== "P"}
            fullWidth
          />
        )}
        <TextField
          type="text"
          id="usage_reason"
          label={t("usageReason")}
          required
          onChange={(e) => setUsageReason(e.target.value)}
          value={usageReason}
          disabled={status !== "P"}
          multiline
          rows={4}
          fullWidth
        />
        {loading && <CircularProgress />}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
            width: "100%",
          }}
        >
          <Button
            type="submit"
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={(e) => goBack(e)}
            startIcon={<ArrowBackIosNew />}
          >
            {t("back")}
          </Button>
          <Box>
            {status === "O" && (
              <Button
                type="submit"
                variant="contained"
                color="error"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenDialog(true);
                }}
                sx={{ mr: 1 }}
              >
                {t("cancel")}
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              onClick={(e) => handleUpdate(e)}
              sx={{ ml: 1 }}
            >
              {t("update")}
            </Button>
          </Box>
        </Box>
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{t("areYouSure")}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t("doYouReallyCancel")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>{t("cancel")}</Button>
            <Button onClick={(e) => handleCancel(e)} autoFocus color="error">
              {t("confirm")}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default UpdateRequest;
