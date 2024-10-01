import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import NavBar from "./NavBar";
import { Box, TextField, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

const ViewRequest = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [usageReason, setUsageReason] = useState("");
  const [product, setProduct] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [status, setStatus] = useState("");
  const [orientation, setOrientation] = useState("");

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getRequest();
  }, []);

  const getRequest = () => {
    api
      .get(`/licensemanagementapi/requests/${id}/`)
      .then((res) => {
        setUsageReason(res.data.usage_reason ? res.data.usage_reason : "N/A");
        setProduct(res.data.product ? res.data.product_display : "N/A");
        setNewProduct(res.data.new_product ? res.data.new_product : "N/A");
        setStatus(res.data.status_display ? res.data.status_display : "N/A");
        setOrientation(res.data.orientation ? res.data.orientation : "N/A");
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
          {t("viewRequest")}
        </Typography>
        <TextField
          type="text"
          id="product"
          label={t("product")}
          required
          value={product}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
        <TextField
          type="text"
          id="new_product"
          label={t("newProduct")}
          required
          value={newProduct}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
        <TextField
          type="text"
          id="usage_reason"
          label={t("usageReason")}
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
          label={t("status")}
          required
          value={status}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
        <TextField
          type="text"
          id="orientation"
          label={t("orientation")}
          required
          value={orientation}
          multiline
          rows={4}
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
          {t("back")}
        </Button>
      </Box>
    </>
  );
};

export default ViewRequest;
