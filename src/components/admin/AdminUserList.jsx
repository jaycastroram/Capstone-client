import { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import {
  TrashIcon,
  Pencil1Icon,
  PlusIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { toast } from "react-hot-toast";
import {
  addPhotographer,
  updatePhotographer,
} from "../../managers/photographerManager";
import {
  getAllUsers,
  updateUser,
  deleteUser,
} from "../../managers/userManager";
import "./Admin.css";

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    portfolioLink: "",
    isVerified: false,
    imageLocation: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setForm({
        firstName: selectedUser.firstName || "",
        lastName: selectedUser.lastName || "",
        email: selectedUser.email || "",
        bio: selectedUser.photographer?.bio || "",
        portfolioLink: selectedUser.photographer?.portfolioLink || "",
        isVerified: selectedUser.isVerified || false,
        imageLocation: selectedUser.imageLocation || "",
      });
    } else {
      resetForm();
    }
  }, [selectedUser]);

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      bio: "",
      portfolioLink: "",
      isVerified: false,
      imageLocation: "",
    });
  };

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, form);
        toast.success("Photographer updated successfully");
      } else {
        // Create new photographer with form data
        const result = await addPhotographer({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          bio: form.bio || "",
          portfolioLink: form.portfolioLink || "",
          isVerified: form.isVerified,
        });

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
            duration: 15000,
            style: {
              maxWidth: "500px",
              padding: "16px",
            },
          }
        );
      }
      await loadUsers(); // Refresh the list
      handleCloseForm();
    } catch (error) {
      console.error("Error saving photographer:", error);
      toast.error(
        error.message ||
          (selectedUser
            ? "Failed to update photographer"
            : "Failed to add photographer")
      );
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      bio: user.photographer?.bio || "",
      portfolioLink: user.photographer?.portfolioLink || "",
      isVerified: user.isVerified,
      imageLocation: user.imageLocation || "",
    });
    setImagePreview(user.imageLocation);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedUser(null);
    setImagePreview(null);
    resetForm();
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(userId);
      toast.success("User deleted successfully");
      await loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setForm({ ...form, imageLocation: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (activeTab === "all") return true;
    return user.role.toLowerCase() === activeTab;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <Tabs.Root defaultValue="all" onValueChange={setActiveTab}>
          <Tabs.List className="tabs-list">
            <Tabs.Trigger className="tab-trigger" value="all">
              All Users
            </Tabs.Trigger>
            <Tabs.Trigger className="tab-trigger" value="user">
              Regular Users
            </Tabs.Trigger>
            <Tabs.Trigger className="tab-trigger" value="photographer">
              Photographers
            </Tabs.Trigger>
            <Tabs.Trigger className="tab-trigger" value="admin">
              Admins
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        {activeTab === "photographer" && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <PlusIcon /> Add Photographer
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <div className="avatar">
                      {user.imageLocation ? (
                        <img src={user.imageLocation} alt={user.firstName} />
                      ) : (
                        <span>{user.firstName[0]}</span>
                      )}
                    </div>
                    <span>{`${user.firstName} ${user.lastName}`}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span
                    className={`status ${
                      user.isVerified ? "verified" : "pending"
                    }`}
                  >
                    {user.isVerified ? "Verified" : "Pending"}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleEditUser(user)}
                    >
                      <Pencil1Icon />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog.Root open={showForm} onOpenChange={handleCloseForm}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <Dialog.Title className="dialog-title">
              {selectedUser ? "Edit User" : "Add Photographer"}
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="form">
              {!selectedUser ? (
                // New photographer form - simplified
                <>
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                      required
                      className="text-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                      required
                      className="text-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                      className="text-input"
                    />
                  </div>

                  <div className="form-info">
                    <p className="info-text">
                      The photographer will be prompted to complete their
                      profile and change their password on first login.
                    </p>
                  </div>
                </>
              ) : (
                // Existing edit form
                <>
                  <div className="form-image">
                    <div className="avatar-large">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" />
                      ) : (
                        <span>{form.firstName[0] || "U"}</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                      required
                      className="text-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                      required
                      className="text-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) =>
                        setForm({ ...form, bio: e.target.value })
                      }
                      className="text-input"
                      rows={4}
                    />
                  </div>

                  <div className="form-group">
                    <label>Portfolio Link</label>
                    <input
                      type="url"
                      value={form.portfolioLink}
                      onChange={(e) =>
                        setForm({ ...form, portfolioLink: e.target.value })
                      }
                      placeholder="https://..."
                      className="text-input"
                    />
                  </div>

                  <div className="form-group switch-group">
                    <label>Verified User</label>
                    <Switch.Root
                      checked={form.isVerified}
                      onCheckedChange={(checked) =>
                        setForm({ ...form, isVerified: checked })
                      }
                      className="switch-root"
                    >
                      <Switch.Thumb className="switch-thumb" />
                    </Switch.Root>
                  </div>
                </>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseForm}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {selectedUser ? "Save Changes" : "Add Photographer"}
                </button>
              </div>
            </form>

            <Dialog.Close asChild>
              <button className="close-button" aria-label="Close">
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default AdminUserList;
