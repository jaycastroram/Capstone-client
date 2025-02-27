import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../managers/authManager";
import { Button, Avatar, Flex } from "@radix-ui/themes";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { PersonIcon, ExitIcon, CameraIcon } from "@radix-ui/react-icons";
import "./NavBar.css";

export default function NavBar({ loggedInUser, setLoggedInUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();
    console.log("Logging out");
    logoutUser().then(() => {
      setLoggedInUser(null);
      navigate("/login", { replace: true });
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <CameraIcon width="24" height="24" />
          Photography Booking
        </Link>

        {loggedInUser && (
          <NavigationMenu.Root>
            <NavigationMenu.List className="nav-menu">
              <NavigationMenu.Item>
                <Link to="/photographers">Photographers</Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <Link to="/bookings">My Bookings</Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>
        )}
      </div>
      <div className="navbar-right">
        {loggedInUser ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost">
                <Avatar
                  src={loggedInUser.imageLocation}
                  fallback={loggedInUser.firstName[0]}
                  size="2"
                />
                {loggedInUser.firstName}
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="dropdown-content" sideOffset={5}>
                <DropdownMenu.Item className="dropdown-item" onClick={handleLogout}>
                  <ExitIcon />
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ) : (
          <Flex gap="3">
            <Link to="/login">
              <Button variant="soft">
                <PersonIcon />
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="solid">
                Register
              </Button>
            </Link>
          </Flex>
        )}
      </div>
    </nav>
  );
}
