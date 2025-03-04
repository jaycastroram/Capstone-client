import { useState, useEffect } from "react";
import { Text, Box, Card, Flex, Tabs } from "@radix-ui/themes";
import { getUserBookings, getPendingInquiries } from "../../managers/bookingManager";

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [pendingInquiries, setPendingInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingsData, inquiriesData] = await Promise.all([
        getUserBookings(),
        getPendingInquiries()
      ]);
      setBookings(bookingsData);
      setPendingInquiries(inquiriesData);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Flex direction="column" gap="4">
      <Text size="6" mb="4" weight="bold">
        My Bookings
      </Text>

      <Tabs.Root defaultValue="bookings">
        <Tabs.List>
          <Tabs.Trigger value="bookings">Confirmed Bookings</Tabs.Trigger>
          <Tabs.Trigger value="pending">
            Pending Inquiries ({pendingInquiries.length})
          </Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <Tabs.Content value="bookings">
            <Flex direction="column" gap="3">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <Flex direction="column" gap="2">
                    <Text weight="medium">
                      Package: {booking.package?.name}
                    </Text>
                    <Text>Date: {new Date(booking.bookingDate).toLocaleDateString()}</Text>
                    <Text>Status: {booking.status}</Text>
                    <Text>Amount: ${booking.totalAmount}</Text>
                    {booking.notes && (
                      <Text>Notes: {booking.notes}</Text>
                    )}
                  </Flex>
                </Card>
              ))}
              {bookings.length === 0 && (
                <Text color="gray">No confirmed bookings yet.</Text>
              )}
            </Flex>
          </Tabs.Content>

          <Tabs.Content value="pending">
            <Flex direction="column" gap="3">
              {pendingInquiries.map((inquiry) => (
                <Card key={inquiry.id}>
                  <Flex direction="column" gap="2">
                    <Text weight="medium">
                      Photographer: {inquiry.photographer?.name}
                    </Text>
                    <Text>Package: {inquiry.package?.name}</Text>
                    <Text>Status: {inquiry.status}</Text>
                    <Text>Message: {inquiry.message}</Text>
                    {inquiry.response && (
                      <Text>Response: {inquiry.response}</Text>
                    )}
                  </Flex>
                </Card>
              ))}
              {pendingInquiries.length === 0 && (
                <Text color="gray">No pending inquiries.</Text>
              )}
            </Flex>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Flex>
  );
}
