const _apiUrl = "/api/inquiry";

export const getInquiries = async () => {
  const response = await fetch(_apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch inquiries");
  }

  return await response.json();
};

export const getInquiryById = async (id) => {
  const response = await fetch(`${_apiUrl}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch inquiry");
  }

  return await response.json();
};

export const createInquiry = async (inquiry) => {
  const response = await fetch(_apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inquiry),
  });

  if (!response.ok) {
    throw new Error("Failed to create inquiry");
  }

  return await response.json();
};

export const updateInquiryStatus = async (id, status) => {
  const response = await fetch(`${_apiUrl}/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update inquiry status");
  }

  return await response.json();
};

export const createBookingFromInquiry = async (inquiryId) => {
  const response = await fetch(`${_apiUrl}/${inquiryId}/booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to create booking from inquiry");
  }

  return await response.json();
};
