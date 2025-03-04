import { useState, useEffect } from "react";
import { Text, Box, Card, Flex, Button, Select, Tabs } from "@radix-ui/themes";
import { getAllBookings, updateBookingStatus } from "../../managers/bookingManager";
import { toast } from "react-hot-toast";

export default function AdminBookingList() {
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data.bookings);
      setInquiries(data.inquiries);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load bookings");
      console.error("Error loading bookings:", error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, type, newStatus) => {
    try {
      await updateBookingStatus(id, type, newStatus);
      toast.success("Status updated successfully");
      loadBookings();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const StatusSelector = ({ currentStatus, onStatusChange }) => (
    <Select.Root value={currentStatus} onValueChange={onStatusChange}>
      <Select.Trigger />
      <Select.Content>
        <Select.Item value="pending">Pending</Select.Item>
        <Select.Item value="confirmed">Confirmed</Select.Item>
        <Select.Item value="completed">Completed</Select.Item>
        <Select.Item value="cancelled">Cancelled</Select.Item>
      </Select.Content>
    </Select.Root>
  );

  if (loading) return <div>Loading...</div>;

  return (
    <Flex direction="column" gap="4">
      <Text size="6" weight="bold">Manage Bookings</Text>

      <Tabs.Root defaultValue="bookings">
        <Tabs.List>
          <Tabs.Trigger value="bookings">
            Confirmed Bookings ({bookings.length})
          </Tabs.Trigger>
          <Tabs.Trigger value="inquiries">
            Pending Inquiries ({inquiries.length})
          </Tabs.Trigger>
        </Tabs.List>

        <Box pt="4">
          <Tabs.Content value="bookings">
            <Flex direction="column" gap="3">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <Flex justify="between" align="center" gap="4">
                    <Box>
                      <Text weight="bold">
                        {booking.user?.firstName} {booking.user?.lastName}
                      </Text>
                      <Text size="2">Package: {booking.package?.name}</Text>
                      <Text size="2">
                        Date: {new Date(booking.bookingDate).toLocaleDateString()}
                      </Text>
                    </Box>
                    <Flex align="center" gap="2">
                      <Text size="2">Status:</Text>
                      <StatusSelector
                        currentStatus={booking.status}
                        onStatusChange={(newStatus) => 
                          handleStatusChange(booking.id, 'booking', newStatus)
                        }
                      />
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Flex>
          </Tabs.Content>

          <Tabs.Content value="inquiries">
            <Flex direction="column" gap="3">
              {inquiries.map((inquiry) => (
                <Card key={inquiry.id}>
                  <Flex justify="between" align="center" gap="4">
                    <Box>
                      <Text weight="bold">
                        {inquiry.user?.firstName} {inquiry.user?.lastName}
                      </Text>
                      <Text size="2">Package: {inquiry.package?.name}</Text>
                      <Text size="2">Message: {inquiry.message}</Text>
                    </Box>
                    <Flex align="center" gap="2">
                      <Text size="2">Status:</Text>
                      <StatusSelector
                        currentStatus={inquiry.status}
                        onStatusChange={(newStatus) => 
                          handleStatusChange(inquiry.id, 'inquiry', newStatus)
                        }
                      />
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Flex>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Flex>
  );
} 