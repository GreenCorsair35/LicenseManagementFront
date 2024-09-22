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
import logo from "../assets/logo.png";

const pages = [
  { id: 1, menuName: "Requests List", menuLink: "/" },
  { id: 2, menuName: "Request a License", menuLink: "/create-request" },
];

function NavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
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
          DCRD - LICENSES REQUESTS
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
          DCRD - LICENSES REQUESTS
        </Typography>
        <Button color="inherit">
          <Typography
            variant="subtitle2"
            component="a"
            href="/logout"
            sx={{
              textAlign: "center",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Logout
          </Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
