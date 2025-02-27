import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Form from "@radix-ui/react-form";
import { Container, Text } from "@radix-ui/themes";
import { loginUser } from "../../managers/authManager";

export default function Login({ setLoggedInUser }) {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const user = await loginUser(data.email, data.password);
      if (!user || !user.role) {
        console.error("Invalid user data received:", user);
        throw new Error("Invalid user data");
      }
      console.log("Login successful - User role:", user.role);
      setLoggedInUser(user);
      navigate("/photographers", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    }
  };

  return (
    <Container size="2" className="mt-10">
      <Text size="6" weight="bold" align="center" mb="4">
        Login
      </Text>

      <Form.Root onSubmit={handleSubmit}>
        <Form.Field className="mb-4" name="email">
          <Form.Label className="block mb-2 text-sm font-medium">
            Email
          </Form.Label>
          <Form.Control asChild>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              type="email"
              required
            />
          </Form.Control>
          <Form.Message className="text-sm text-red-500" match="valueMissing">
            Please enter your email
          </Form.Message>
          <Form.Message className="text-sm text-red-500" match="typeMismatch">
            Please provide a valid email
          </Form.Message>
        </Form.Field>

        <Form.Field className="mb-4" name="password">
          <Form.Label className="block mb-2 text-sm font-medium">
            Password
          </Form.Label>
          <Form.Control asChild>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              type="password"
              required
            />
          </Form.Control>
          <Form.Message className="text-sm text-red-500" match="valueMissing">
            Please enter your password
          </Form.Message>
        </Form.Field>

        {error && (
          <Text color="red" size="2" className="mb-4">
            {error}
          </Text>
        )}

        <Form.Submit asChild>
          <button
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            type="submit"
          >
            Login
          </button>
        </Form.Submit>
      </Form.Root>
    </Container>
  );
}
