const apiUrl = "http://localhost:5001/api";
import { registerUser } from "./authManager";

export const getAllPhotographers = async () => {
  try {
    const response = await fetch(`${apiUrl}/photographer`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch photographers");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getAllPhotographers:", error);
    throw error;
  }
};

export const getPhotographerById = async (id) => {
  const response = await fetch(`${apiUrl}/photographer/${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch photographer");
  return await response.json();
};

export const createPhotographer = async (photographerData) => {
  const response = await fetch(`${apiUrl}/photographer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(photographerData),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to create photographer");
  return await response.json();
};

export const updatePhotographer = async (id, formData) => {
  try {
    // Convert FormData to match UpdatePhotographerDTO
    const photographerDto = {
      name: `${formData.get("firstName")} ${formData.get("lastName")}`,
      bio: formData.get("bio"),
      portfolioLink: formData.get("portfolioLink"),
    };

    const response = await fetch(`${apiUrl}/photographer/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(photographerDto),
    });

    if (response.status === 204) {
      // Successfully updated, now fetch the updated data
      return await getAllPhotographers(); // This will refresh the entire list
    }

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Failed to update photographer");
    }
  } catch (error) {
    console.error("Error in updatePhotographer:", error);
    throw error;
  }
};

export const deletePhotographer = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/photographer/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Failed to delete photographer");
    }

    return true;
  } catch (error) {
    console.error("Error deleting photographer:", error);
    throw error;
  }
};

export const addPhotographer = async (formData) => {
  try {
    // Create registration data that matches our registration process
    const registrationData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: "Password123!", // Default password
      role: "Photographer",
      isVerified: false,
    };

    const result = await registerUser(registrationData);

    // Create the photographer profile
    const photographer = {
      userId: result.id,
      bio: formData.bio || null,
      portfolioLink: formData.portfolioLink || null,
      profileImage: formData.imageLocation || null,
      contactInfo: null,
    };

    const response = await fetch(`${apiUrl}/photographer/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(photographer),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Failed to create photographer profile");
    }

    return {
      ...result,
      message: "Photographer account created successfully",
      email: registrationData.email,
    };
  } catch (error) {
    console.error("Error in addPhotographer:", error);
    throw error;
  }
};

export const createPhotographerProfile = async (profileData) => {
  try {
    const response = await fetch(`${apiUrl}/photographer/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to create photographer profile"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating photographer profile:", error);
    throw error;
  }
};
