import { useEffect, useState } from "react";
import { Spinner } from "@radix-ui/themes";
import { BrowserRouter } from "react-router-dom";
import NavBar from "./components/nav/NavBar";
import ApplicationViews from "./components/ApplicationViews";
import { tryGetLoggedInUser } from "./managers/authManager";
import "./App.css";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(undefined);

  useEffect(() => {
    // user will be null if not authenticated
    tryGetLoggedInUser().then((user) => {
      setLoggedInUser(user);
    });
  }, []);

  // wait to get a definite logged-in state before rendering
  if (loggedInUser === undefined) {
    return <Spinner />;
  }

  return (
    <BrowserRouter>
      <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
      <div className="container mt-4">
        <ApplicationViews
          loggedInUser={loggedInUser}
          setLoggedInUser={setLoggedInUser}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
