import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextArea, Text, Flex, Box } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import { registerUser } from "../../managers/authManager";

export default function Register({ setLoggedInUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    imageLocation: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await registerUser(formData);
      setLoggedInUser(user);
      navigate("/photographers");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <Flex direction="column" gap="4" align="center">
      <Box style={{ width: "100%", maxWidth: "400px" }} p="4">
        <Form.Root onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <Text size="5" mb="4" weight="bold">
              Register New Account
            </Text>
            {error && <Text color="red">{error}</Text>}

            <Form.Field name="firstName">
              <Form.Control asChild>
                <input
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  required
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="lastName">
              <Form.Control asChild>
                <input
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  required
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="userName">
              <Form.Control asChild>
                <input
                  placeholder="Username"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      userName: e.target.value,
                    }))
                  }
                  required
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="email">
              <Form.Control asChild>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="password">
              <Form.Control asChild>
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                />
              </Form.Control>
            </Form.Field>

            <Button type="submit">Register</Button>
          </Flex>
        </Form.Root>
      </Box>
    </Flex>
  );
}
