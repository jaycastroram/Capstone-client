import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getUserBookings } from "../../managers/bookingManager";
import { Text, Box, Card, Flex } from "@radix-ui/themes";

// Regular user view of their bookings
export default function UserBookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserBookings = async () => {
      try {
        const data = await getUserBookings();
        setBookings(data);
      } catch (error) {
        toast.error("Failed to load your bookings");
      } finally {
        setLoading(false);
      }
    };
    loadUserBookings();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Flex direction="column" gap="4">
      <Text size="6" weight="bold">
        My Bookings
      </Text>
      {bookings.length === 0 ? (
        <Text>No bookings found</Text>
      ) : (
        <Flex direction="column" gap="3">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <Box>
                <Text weight="bold">Package: {booking.package?.name}</Text>
                <Text size="2">Status: {booking.status}</Text>
                <Text size="2">
                  Date: {new Date(booking.bookingDate).toLocaleDateString()}
                </Text>
              </Box>
            </Card>
          ))}
        </Flex>
      )}
    </Flex>
  );
}
