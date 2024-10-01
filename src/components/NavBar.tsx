import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import logo from "../assets/logo.png";
import { useTranslation } from "react-i18next";

function NavBar() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "fr" : "en";
    i18n.changeLanguage(newLanguage);
  };

  const pages = [
    { id: 1, menuName: t("requestsList"), menuLink: "/" },
    { id: 2, menuName: t("requestALicense"), menuLink: "/create-request" },
  ];

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" elevation={5}>
      <Toolbar sx={{ backgroundColor: "#f5821f" }}>
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{
            display: { xs: "none", md: "flex" },
            height: 40,
            marginRight: 2,
          }}
        />
        <Typography
          variant="h5"
          noWrap
          component="a"
          href="/"
          sx={{
            display: { xs: "none", md: "flex" },
            fontFamily: "monospace",
            fontWeight: 500,
            color: "inherit",
            textDecoration: "none",
            flexGrow: 1,
          }}
        >
          {t("appTitle")}
        </Typography>
        <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
          {pages.map((page) => (
            <Button
              key={page.id}
              onClick={handleCloseNavMenu}
              sx={{
                my: 2,
                color: "white",
                display: "block",
                textDecoration: "none",
              }}
            >
              <Typography
                variant="subtitle2"
                component="a"
                href={page.menuLink}
                sx={{
                  textAlign: "center",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                {page.menuName}
              </Typography>
            </Button>
          ))}
        </Box>

        {/* show menu for small screens */}
        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="menu-bars"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            {pages.map((page) => (
              <MenuItem key={page.id} onClick={handleCloseNavMenu}>
                <Typography
                  component="a"
                  href={page.menuLink}
                  sx={{
                    textAlign: "center",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  {page.menuName}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <Typography
          variant="h5"
          noWrap
          component="a"
          href="/"
          sx={{
            display: { xs: "flex", md: "none" },
            flexGrow: 1,
            fontFamily: "monospace",
            fontWeight: 500,
            color: "inherit",
            textDecoration: "none",
          }}
        >
          {t("appTitle")}
        </Typography>

        <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "flex" }, ml: 2 }}>
          <IconButton
            size="large"
            aria-label="menu-bars"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="inherit"
            edge="end"
          >
            <ExpandMoreIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            id="logout-menu"
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem>
              <Typography
                variant="subtitle2"
                component="a"
                onClick={() => toggleLanguage()}
                sx={{
                  color: "inherit",
                  textDecoration: "none",
                  width: "100%",
                }}
              >
                {t("lang")}
              </Typography>
            </MenuItem>
            <MenuItem>
              <Typography
                variant="subtitle2"
                component="a"
                href="/logout"
                sx={{
                  color: "inherit",
                  textDecoration: "none",
                  width: "100%",
                }}
              >
                {t("logout")}
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
