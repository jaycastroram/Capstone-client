import { useState } from "react";
import { Button, Box, Card, Text, Select, TextArea, Flex } from "@radix-ui/themes";
import { createInquiry } from "../../managers/inquiryManager";

export default function InquiryForm({ onInquiryCreated }) {
  const [formData, setFormData] = useState({
    photographerId: "",
    packageId: "",
    message: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createInquiry(formData);
      setFormData({ photographerId: "", packageId: "", message: "" });
      onInquiryCreated();
    } catch (err) {
      setError("Failed to create inquiry");
    }
  };

  return (
    <Card size="2">
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="3">
          <Text size="3" weight="bold">
            Create New Inquiry
          </Text>
          {error && <Text color="red">{error}</Text>}

          <Select.Root
            value={formData.photographerId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, photographerId: value }))
            }
          >
            <Select.Trigger placeholder="Select Photographer" />
            <Select.Content>
              {/* We'll populate this with photographers later */}
              <Select.Item value="1">Photographer 1</Select.Item>
              <Select.Item value="2">Photographer 2</Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root
            value={formData.packageId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, packageId: value }))
            }
          >
            <Select.Trigger placeholder="Select Package" />
            <Select.Content>
              {/* We'll populate this with packages later */}
              <Select.Item value="1">Package 1</Select.Item>
              <Select.Item value="2">Package 2</Select.Item>
            </Select.Content>
          </Select.Root>

          <TextArea
            placeholder="Your message..."
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, message: e.target.value }))
            }
            required
          />

          <Button type="submit">Submit Inquiry</Button>
        </Flex>
      </form>
    </Card>
  );
} 