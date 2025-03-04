import { useState } from "react";
import { Box, Text, Button, Avatar, Flex } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import { toast } from "react-hot-toast";
import { updateProfile } from "../../managers/authManager";

export default function Profile({ loggedInUser, setLoggedInUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: loggedInUser?.firstName || "",
    lastName: loggedInUser?.lastName || "",
    email: loggedInUser?.email || "",
    imageLocation: loggedInUser?.imageLocation || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateProfile(formData);
      setLoggedInUser(updatedUser);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // TODO: Implement image upload logic
      toast.success("Profile picture updated successfully");
    }
  };

  if (!loggedInUser) return <div>Loading...</div>;

  return (
    <Box className="max-w-2xl mx-auto mt-8 p-6">
      <Text size="8" weight="bold" mb="6">
        Profile
      </Text>

      <Flex direction="column" gap="6">
        {/* Profile Picture Section */}
        <Box className="text-center">
          <Avatar
            size="8"
            src={loggedInUser.imageLocation}
            fallback={loggedInUser.firstName[0]}
            radius="full"
            className="mx-auto mb-4"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="profile-image-upload"
          />
          <Button
            variant="soft"
            onClick={() =>
              document.getElementById("profile-image-upload").click()
            }
          >
            Change Profile Picture
          </Button>
        </Box>

        {isEditing ? (
          <Form.Root onSubmit={handleSubmit}>
            <Flex direction="column" gap="4">
              <Form.Field name="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control asChild>
                  <input
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                  />
                </Form.Control>
              </Form.Field>

              <Form.Field name="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control asChild>
                  <input
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                  />
                </Form.Control>
              </Form.Field>

              <Form.Field name="email">
                <Form.Label>Email</Form.Label>
                <Form.Control asChild>
                  <input
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.email}
                    type="email"
                    disabled
                  />
                </Form.Control>
              </Form.Field>

              <Flex gap="3" mt="4">
                <Button type="submit" variant="solid">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="soft"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </Flex>
            </Flex>
          </Form.Root>
        ) : (
          <Box>
            <Flex direction="column" gap="4">
              <Box>
                <Text size="2" color="gray">
                  Name
                </Text>
                <Text size="4">
                  {loggedInUser.firstName} {loggedInUser.lastName}
                </Text>
              </Box>

              <Box>
                <Text size="2" color="gray">
                  Email
                </Text>
                <Text size="4">{loggedInUser.email}</Text>
              </Box>

              <Box>
                <Text size="2" color="gray">
                  Role
                </Text>
                <Text size="4" className="capitalize">
                  {loggedInUser.role}
                </Text>
              </Box>

              <Button onClick={() => setIsEditing(true)} variant="soft">
                Edit Profile
              </Button>
            </Flex>
          </Box>
        )}
      </Flex>
    </Box>
  );
}
