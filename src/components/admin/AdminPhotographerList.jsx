import { useState, useEffect } from "react";
import {
  getAllPhotographers,
  addPhotographer,
  updatePhotographer,
  deletePhotographer,
} from "../../managers/photographerManager";
import { Box, Button, Table, Switch, Flex } from "@radix-ui/themes";
import { Cross2Icon, TrashIcon } from "@radix-ui/react-icons";
import { toast } from "react-hot-toast";
import "./Admin.css";
import * as Dialog from "@radix-ui/react-dialog";

const AdminPhotographerList = () => {
  const [photographers, setPhotographers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPhotographer, setSelectedPhotographer] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    portfolioLink: "",
    isVerified: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    loadPhotographers();
  }, []);

  useEffect(() => {
    if (selectedPhotographer) {
      setForm({
        firstName: selectedPhotographer.user?.firstName || "",
        lastName: selectedPhotographer.user?.lastName || "",
        email: selectedPhotographer.user?.email || "",
        bio: selectedPhotographer.bio || "",
        portfolioLink: selectedPhotographer.portfolioLink || "",
        isVerified: selectedPhotographer.user?.isVerified || false,
      });
      setImagePreview(selectedPhotographer.user?.imageLocation);
    } else {
      resetForm();
    }
  }, [selectedPhotographer]);

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      bio: "",
      portfolioLink: "",
      isVerified: false,
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const loadPhotographers = async () => {
    try {
      const data = await getAllPhotographers();
      setPhotographers(data);
    } catch (error) {
      console.error("Error loading photographers:", error);
      toast.error("Failed to load photographers");
    }
  };

  const handleEdit = (photographer) => {
    setSelectedPhotographer(photographer);
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append all form fields
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    try {
      if (selectedPhotographer) {
        await updatePhotographer(selectedPhotographer.id, formData);
        toast.success("Photographer updated successfully");
      } else {
        const result = await addPhotographer(formData);
        toast(
          (t) => (
            <div>
              <p>Photographer account created successfully!</p>
              <p>Default login credentials:</p>
              <p>
                <strong>Email:</strong> {result.email}
              </p>
              <p>
                <strong>Password:</strong> Password123!
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Note: The photographer will be prompted to change their password
                on first login.
              </p>
            </div>
          ),
          {
            duration: 15000, // Show for 15 seconds
            style: {
              maxWidth: "500px",
              padding: "16px",
            },
          }
        );
      }
      await loadPhotographers(); // Refresh the list
      handleCloseForm();
    } catch (error) {
      console.error("Error saving photographer:", error);
      toast.error(
        error.message ||
          (selectedPhotographer
            ? "Failed to update photographer"
            : "Failed to add photographer")
      );
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedPhotographer(null);
    resetForm();
  };

  const handleDelete = async (photographer) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${photographer.name}? This action cannot be undone.`
      )
    ) {
      try {
        await deletePhotographer(photographer.id);
        toast.success("Photographer deleted successfully");
        await loadPhotographers(); // Refresh the list
      } catch (error) {
        console.error("Error deleting photographer:", error);
        toast.error("Failed to delete photographer");
      }
    }
  };

  return (
    <Box p="4">
      <Box mb="4">
        <Button onClick={() => setShowForm(true)}>Add Photographer</Button>
      </Box>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Image</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {photographers.map((photographer) => (
            <Table.Row key={photographer.id}>
              <Table.Cell>
                <img
                  src={
                    photographer.user?.imageLocation || "/default-avatar.png"
                  }
                  alt={photographer.name}
                  style={{ width: 40, height: 40, borderRadius: "50%" }}
                />
              </Table.Cell>
              <Table.Cell>{photographer.name}</Table.Cell>
              <Table.Cell>{photographer.user?.email}</Table.Cell>
              <Table.Cell>
                <span
                  className={`status-badge ${
                    photographer.user?.isVerified ? "verified" : "pending"
                  }`}
                >
                  {photographer.user?.isVerified ? "Verified" : "Pending"}
                </span>
              </Table.Cell>
              <Table.Cell>
                <Flex gap="2">
                  <Button
                    variant="soft"
                    onClick={() => handleEdit(photographer)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="soft"
                    color="red"
                    onClick={() => handleDelete(photographer)}
                  >
                    <TrashIcon />
                  </Button>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <Box
              mb="4"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>
                {selectedPhotographer
                  ? "Edit Photographer"
                  : "Add Photographer"}
              </h2>
              <Button variant="ghost" onClick={handleCloseForm}>
                <Cross2Icon />
              </Button>
            </Box>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="image-upload">
                  <img
                    src={imagePreview || "/default-avatar.png"}
                    alt="Profile preview"
                    className="image-preview"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  required
                />
              </div>

              {!selectedPhotographer && (
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  className="form-input"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Portfolio Link</label>
                <input
                  type="url"
                  className="form-input"
                  value={form.portfolioLink}
                  onChange={(e) =>
                    setForm({ ...form, portfolioLink: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <Flex align="center" gap="2">
                  <Switch
                    checked={form.isVerified}
                    onCheckedChange={(checked) =>
                      setForm({ ...form, isVerified: checked })
                    }
                  />
                  <label className="form-label" style={{ margin: 0 }}>
                    Verified Photographer
                  </label>
                </Flex>
              </div>

              <Flex gap="3" justify="end">
                <Button
                  type="button"
                  variant="soft"
                  color="gray"
                  onClick={handleCloseForm}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedPhotographer ? "Save Changes" : "Add Photographer"}
                </Button>
              </Flex>
            </form>
          </div>
        </div>
      )}
    </Box>
  );
};

export default AdminPhotographerList;
