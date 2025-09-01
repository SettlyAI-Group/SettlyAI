import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  styled,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link, type LinkProps } from "react-router-dom";
import GlobalButton from "../GlobalButton/GlobalButton";
import navhomeImage from "../../assets/NavHome.png";
import type { ComponentProps } from "react";


type GlobalButtonBaseProps = ComponentProps<typeof GlobalButton>;

type GlobalLinkButtonProps = GlobalButtonBaseProps &
  Pick<LinkProps, "to" | "replace" | "state">;

const GlobalLinkButton = (props: GlobalLinkButtonProps) => (
  <GlobalButton component={Link} {...props} />
);

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.background.paper,
  boxShadow: "none",
}));

const StyledToolbar = styled(Toolbar)({
  minHeight: 72,
  justifyContent: "space-between",
  padding: 0,
});

const HomeSection = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
});

const HomeIconContainer = styled(Box)({
  width: 40,
  height: 40,
  background: "#7B61FF",
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const NavLinks = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 24,
});


const Navbar = () => {
  const navigate = useNavigate();

  const StyledContainer = styled(Container)({
    maxWidth: 1440,
    marginLeft: "auto",
    marginRight: "auto",
  });

  const StyledTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary, // instead of #1F2937
    fontWeight: 600,
    fontSize: 20,
  }));

  return (
    <StyledAppBar position="static" elevation={0}>
      <StyledContainer maxWidth={false}>
        <StyledToolbar disableGutters>
          <HomeSection onClick={() => navigate("/")}>
            <HomeIconContainer>
              <img
                src={navhomeImage}
                alt="Home"
                style={{ width: 24, height: 24 }}
              />
            </HomeIconContainer>
            <StyledTypography variant="h6">Settly AI</StyledTypography>
          </HomeSection>

          <NavLinks>
            <GlobalLinkButton to="/about" width="100" height="40" textColor="default"
            >
              About
            </GlobalLinkButton>
            <GlobalLinkButton to="/features" width="100" height="40" textColor="default"
            >
              Features
            </GlobalLinkButton>
            <GlobalLinkButton to="/ask-robot" width="100" height="40" textColor="default"
            >
              Ask Robot
            </GlobalLinkButton>
            <GlobalLinkButton to="/favorites" width="100" height="40" textColor="default"
            >
              Favorites
            </GlobalLinkButton>
            <GlobalLinkButton to="/login" width="100" height="40" textColor="default"
            >
              Login
            </GlobalLinkButton>
            <GlobalLinkButton to="/join" width="100" height="40" textColor="white"
            >
              Join
            </GlobalLinkButton>
          </NavLinks>
        </StyledToolbar>
      </StyledContainer>
    </StyledAppBar>
  );
};

export default Navbar;
