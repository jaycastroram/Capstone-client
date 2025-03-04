const apiUrl = "http://localhost:5001/api";

export const getUserBookings = async () => {
  const response = await fetch(`${apiUrl}/booking`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }
  return await response.json();
};

export const getPendingInquiries = async () => {
  const response = await fetch(`${apiUrl}/booking/pending-inquiries`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error('Failed to fetch pending inquiries');
  }
  return await response.json();
};

export const getAllBookings = async () => {
  try {
    console.log("Fetching all bookings...");
    const response = await fetch(`${apiUrl}/booking/all`, {
      method: "GET",
      credentials: "include",
    });
    console.log("Response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error('Failed to fetch bookings');
    }
    const data = await response.json();
    console.log("Received data:", data);
    return data;
  } catch (error) {
    console.error("Error in getAllBookings:", error);
    throw error;
  }
};

export const updateBookingStatus = async (id, type, status) => {
  const response = await fetch(`${apiUrl}/booking/${type}/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error('Failed to update status');
  }
}; 