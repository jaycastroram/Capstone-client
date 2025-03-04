import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../managers/authManager";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Avatar from "@radix-ui/react-avatar";
import {
  PersonIcon,
  ExitIcon,
  CameraIcon,
  GearIcon,
} from "@radix-ui/react-icons";
import "./NavBar.css";

export default function NavBar({ loggedInUser, setLoggedInUser }) {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
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
                <NavigationMenu.Link asChild>
                  <Link to="/photographers">Photographers</Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild>
                  <Link to="/bookings">My Bookings</Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild>
                  <Link to="/inquiries">Inquiries</Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              {(loggedInUser?.role === "Admin" ||
                loggedInUser?.role === "Photographer") && (
                <>
                  <NavigationMenu.Item>
                    <NavigationMenu.Link asChild>
                      <Link to="/admin/users">Manage Users</Link>
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                  <NavigationMenu.Item>
                    <NavigationMenu.Link asChild>
                      <Link to="/admin/bookings">Manage Bookings</Link>
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                </>
              )}
            </NavigationMenu.List>
          </NavigationMenu.Root>
        )}
      </div>

      <div className="navbar-right">
        {loggedInUser ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="dropdown-trigger" asChild>
              <button className="user-button">
                <Avatar.Root className="avatar-root">
                  <Avatar.Image
                    className="avatar-image"
                    src={loggedInUser.imageLocation}
                    alt={loggedInUser.firstName}
                  />
                  <Avatar.Fallback className="avatar-fallback" delayMs={600}>
                    {loggedInUser.firstName.charAt(0)}
                  </Avatar.Fallback>
                </Avatar.Root>
                <span className="user-name">{loggedInUser.firstName}</span>
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className="dropdown-content" sideOffset={5}>
                <DropdownMenu.Item className="dropdown-item">
                  <Link to="/profile" className="dropdown-link">
                    <PersonIcon className="dropdown-icon" />
                    Profile
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="dropdown-separator" />
                <DropdownMenu.Item className="dropdown-item">
                  <button onClick={handleLogout} className="dropdown-button">
                    <ExitIcon className="dropdown-icon" />
                    Logout
                  </button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="nav-button login">
              <PersonIcon />
              Login
            </Link>
            <Link to="/register" className="nav-button register">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
