import { useState, useEffect } from "react";
import { Text, Box, Card, Flex, Avatar } from "@radix-ui/themes";
import { getAllPhotographers } from "../../managers/photographerManager";

export default function PhotographerList() {
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPhotographers();
  }, []);

  const loadPhotographers = async () => {
    try {
      const data = await getAllPhotographers();
      setPhotographers(data);
    } catch (err) {
      setError("Failed to load photographers");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Flex direction="column" gap="4">
      <Text size="6" mb="4" weight="bold">
        Our Photographers
      </Text>

      <Flex wrap="wrap" gap="4">
        {photographers.map((photographer) => (
          <Card key={photographer.id} style={{ width: 300 }}>
            <Flex direction="column" gap="3">
              <Avatar
                size="6"
                src={photographer.user?.imageLocation}
                fallback={photographer.name[0]}
                radius="full"
              />
              <Box>
                <Text size="4" weight="bold">
                  {photographer.name}
                </Text>
                {photographer.bio && (
                  <Text color="gray" size="2">
                    {photographer.bio}
                  </Text>
                )}
              </Box>
              {photographer.portfolioLink && (
                <Text
                  as="a"
                  href={photographer.portfolioLink}
                  target="_blank"
                  size="2"
                >
                  View Portfolio
                </Text>
              )}
            </Flex>
          </Card>
        ))}
        {photographers.length === 0 && (
          <Text color="gray">No photographers available.</Text>
        )}
      </Flex>
    </Flex>
  );
}
