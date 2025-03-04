import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import NavBar from "./components/nav/NavBar";
import ApplicationViews from "./components/ApplicationViews";
import { tryGetLoggedInUser } from "./managers/authManager";
import { Toaster } from "react-hot-toast";
import "./App.css";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    // user will be null if not authenticated
    tryGetLoggedInUser().then((user) => {
      setLoggedInUser(user);
    });
  }, []);

  // wait to get a definite logged-in state before rendering
  if (loggedInUser === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <div className="app-container">
          <NavBar
            loggedInUser={loggedInUser}
            setLoggedInUser={setLoggedInUser}
          />
          <ApplicationViews
            loggedInUser={loggedInUser}
            setLoggedInUser={setLoggedInUser}
          />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
