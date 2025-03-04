import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import { toast } from "react-hot-toast";
import { setInitialPassword } from "../../managers/authManager";
import { createPhotographerProfile } from "../../managers/photographerManager";

export default function FirstLogin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("password");
  const [loading, setLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    email: location.state?.email || "",
    password: "",
    confirmPassword: "",
  });
  const [profileForm, setProfileForm] = useState({
    bio: "",
    portfolioLink: "",
    imageLocation: "",
    contactInfo: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await setInitialPassword({
        email: passwordForm.email,
        password: passwordForm.password,
      });
      toast.success("Password set successfully!");
      setActiveTab("profile"); // Move to profile setup
    } catch (error) {
      toast.error(error.message || "Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProfileForm({ ...profileForm, imageLocation: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPhotographerProfile({
        ...profileForm,
        isVerified: true, // Set to verified once profile is complete
      });
      toast.success("Profile setup complete!");
      navigate("/"); // Redirect to home page
    } catch (error) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="first-login-container">
      <h1>Complete Your Account Setup</h1>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="tabs-list">
          <Tabs.Trigger
            value="password"
            className="tab-trigger"
            disabled={activeTab === "profile"}
          >
            Change Password
          </Tabs.Trigger>
          <Tabs.Trigger
            value="profile"
            className="tab-trigger"
            disabled={activeTab === "password"}
          >
            Profile Setup
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="password" className="tab-content">
          <form onSubmit={handlePasswordSubmit} className="form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={passwordForm.email}
                readOnly
                className="text-input"
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={passwordForm.password}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, password: e.target.value })
                }
                required
                className="text-input"
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                required
                className="text-input"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Setting Password..." : "Set Password"}
            </button>
          </form>
        </Tabs.Content>

        <Tabs.Content value="profile" className="tab-content">
          <form onSubmit={handleProfileSubmit} className="form">
            <div className="form-image">
              <div className="avatar-large">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" />
                ) : (
                  <span>📸</span>
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
              <label>Bio</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, bio: e.target.value })
                }
                required
                className="text-input"
                rows={4}
                placeholder="Tell us about yourself and your photography..."
              />
            </div>

            <div className="form-group">
              <label>Portfolio Link</label>
              <input
                type="url"
                value={profileForm.portfolioLink}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    portfolioLink: e.target.value,
                  })
                }
                placeholder="https://..."
                className="text-input"
              />
            </div>

            <div className="form-group">
              <label>Contact Information</label>
              <input
                type="text"
                value={profileForm.contactInfo}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    contactInfo: e.target.value,
                  })
                }
                required
                placeholder="Phone number or preferred contact method"
                className="text-input"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving Profile..." : "Complete Setup"}
            </button>
          </form>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
