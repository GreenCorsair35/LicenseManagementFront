import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const CreateRequest = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [product, setProduct] = useState<productObject | null>(null);
  const [newProduct, setNewProduct] = useState("");
  const [usageReason, setUsageReason] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultObject>({});
  const [show, setShow] = useState(false);
  const [severity, setSeverity] = useState<AlertSeverity>("info");

  const [open, setOpen] = useState(false);
  const [loadingCB, setLoadingCB] = useState(false);
  const [options, setOptions] = useState([]);

  // Automatically close the alert after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 10000);
    return () => clearTimeout(timer); // Clear timeout if component unmounts or if alert is closed manually
  }, []);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    setShow(false);

    api
      .post("/licensemanagementapi/requests/", {
        product: product ? product.product_id : null,
        new_product: newProduct,
        usage_reason: usageReason,
      })
      .then((res: any) => {
        if (res.status === 201) {
          setResult({ successful: t("requestCreateSuccess") });
          setSeverity("success");
        } else {
          setResult({ failure: t("requestCreateError") });
          setSeverity("error");
        }
        setShow(true);
      })
      .catch((error: any) => {
        console.log(error.response.data);
        setResult(error.response.data);
        setSeverity("error");
        setShow(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const goBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate("/"); // Go back to the previous page
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
        autoComplete="off"
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          {t("createRequest")}
        </Typography>
        <Autocomplete
          value={product}
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
          <Button type="submit" variant="contained" sx={{ ml: 1 }}>
            {t("submit")}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default CreateRequest;
