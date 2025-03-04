import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Text, Button, Flex } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import { setInitialPassword, logoutUser } from "../../managers/authManager";
import { toast } from "react-hot-toast";

export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isFirstLogin, email } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (form.password !== form.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      await setInitialPassword({
        email: email,
        password: form.password,
      });

      // Log out the user to force a fresh login with the new password
      await logoutUser();

      toast.success(
        "Password changed successfully! Please log in with your new password."
      );
      navigate("/login");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  if (!isFirstLogin || !email) {
    navigate("/login");
    return null;
  }

  return (
    <Container size="2" className="mt-10">
      <Text size="6" weight="bold" align="center" mb="4">
        Change Your Password
      </Text>

      <Form.Root onSubmit={handleSubmit}>
        <Flex direction="column" gap="4">
          <Form.Field name="password">
            <Form.Label>New Password</Form.Label>
            <Form.Control asChild>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                required
                minLength={6}
              />
            </Form.Control>
          </Form.Field>

          <Form.Field name="confirmPassword">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control asChild>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                required
              />
            </Form.Control>
          </Form.Field>

          <Button type="submit" disabled={loading}>
            {loading ? "Changing Password..." : "Change Password"}
          </Button>
        </Flex>
      </Form.Root>
    </Container>
  );
}
