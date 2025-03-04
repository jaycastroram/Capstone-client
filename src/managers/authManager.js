const apiUrl = "http://localhost:5001/api/auth";

export const logoutUser = () => {
  return fetch(`${apiUrl}/logout`, {
    method: "GET",
    credentials: "include",
  }).then(() => {
    // No need to handle response, just clear any local state
    return Promise.resolve();
  });
};

export const tryGetLoggedInUser = async () => {
  try {
    const response = await fetch(`${apiUrl}/me`, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch {
    return null;
  }
};

export const loginUser = (email, password) => {
  return fetch(`${apiUrl}/login`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${email}:${password}`)}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("Invalid login attempt");
    })
    .catch((error) => {
      throw error;
    });
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch("http://localhost:5001/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: btoa(userData.password),
        role: userData.role,
        isVerified: userData.isVerified || false,
        imageLocation: userData.imageLocation,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Registration error:", error);
      throw new Error(error.errors ? error.errors[0] : "Registration failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const setInitialPassword = async (credentials) => {
  try {
    // First, ensure we're logged out
    await logoutUser();

    console.log("Setting initial password for:", credentials.email);

    const response = await fetch(`${apiUrl}/set-initial-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    console.log("Password set response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(errorText || "Failed to set password");
    }

    const result = await response.text();
    console.log("Password set successfully:", result);
    return { message: result };
  } catch (error) {
    console.error("Error setting initial password:", error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await fetch(`${apiUrl}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Failed to update profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
