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
  const response = await fetch("http://localhost:5001/api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
    credentials: "include"
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Registration error:", error);
    throw new Error('Registration failed');
  }

  return await response.json();
};
