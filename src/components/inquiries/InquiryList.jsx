import { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import * as Form from "@radix-ui/react-form";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { toast } from "react-hot-toast";
import "./Inquiry.css";

export default function InquiryList({ loggedInUser }) {
  const [inquiries, setInquiries] = useState([]);
  const [photographers, setPhotographers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    photographerId: "",
    packageId: "",
    message: "",
    preferredDate: "",
    eventType: "",
    location: "",
    estimatedDuration: "",
    budget: "",
    specialRequirements: "",
  });

  useEffect(() => {
    loadInquiries();
    loadPhotographers();
  }, []);

  const loadInquiries = async () => {
    try {
      // TODO: Implement getInquiries function
      const data = await getInquiries();
      setInquiries(data);
    } catch (error) {
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  const loadPhotographers = async () => {
    try {
      // TODO: Implement getAllPhotographers function
      const data = await getAllPhotographers();
      setPhotographers(data);
    } catch (error) {
      toast.error("Failed to load photographers");
    }
  };

  const loadPackages = async (photographerId) => {
    try {
      // TODO: Implement getPackagesByPhotographer function
      const data = await getPackagesByPhotographer(photographerId);
      setPackages(data);
    } catch (error) {
      toast.error("Failed to load packages");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement createInquiry function
      await createInquiry(formData);
      toast.success("Inquiry submitted successfully");
      setShowForm(false);
      loadInquiries();
    } catch (error) {
      toast.error("Failed to submit inquiry");
    }
  };

  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      // TODO: Implement updateInquiryStatus function
      await updateInquiryStatus(inquiryId, newStatus);
      toast.success("Status updated successfully");
      loadInquiries();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleCreateBooking = async (inquiry) => {
    try {
      // TODO: Implement createBookingFromInquiry function
      await createBookingFromInquiry(inquiry);
      toast.success("Booking created successfully");
      loadInquiries();
    } catch (error) {
      toast.error("Failed to create booking");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="inquiries-container">
      <div className="header">
        <h2>Inquiries</h2>
        {loggedInUser?.role === "User" && (
          <button
            className="new-inquiry-button"
            onClick={() => setShowForm(true)}
          >
            <PlusIcon />
            New Inquiry
          </button>
        )}
      </div>

      <Tabs.Root defaultValue="all" className="tabs-root">
        <Tabs.List className="tabs-list">
          <Tabs.Trigger value="all" className="tab-trigger">
            All
          </Tabs.Trigger>
          <Tabs.Trigger value="pending" className="tab-trigger">
            Pending
          </Tabs.Trigger>
          <Tabs.Trigger value="approved" className="tab-trigger">
            Approved
          </Tabs.Trigger>
          <Tabs.Trigger value="closed" className="tab-trigger">
            Closed
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="all" className="tab-content">
          <InquiryTable
            inquiries={inquiries}
            loggedInUser={loggedInUser}
            onStatusChange={handleStatusChange}
            onCreateBooking={handleCreateBooking}
          />
        </Tabs.Content>

        <Tabs.Content value="pending" className="tab-content">
          <InquiryTable
            inquiries={inquiries.filter((i) => i.status === "pending")}
            loggedInUser={loggedInUser}
            onStatusChange={handleStatusChange}
            onCreateBooking={handleCreateBooking}
          />
        </Tabs.Content>

        <Tabs.Content value="approved" className="tab-content">
          <InquiryTable
            inquiries={inquiries.filter((i) => i.status === "approved")}
            loggedInUser={loggedInUser}
            onStatusChange={handleStatusChange}
            onCreateBooking={handleCreateBooking}
          />
        </Tabs.Content>

        <Tabs.Content value="closed" className="tab-content">
          <InquiryTable
            inquiries={inquiries.filter((i) => i.status === "closed")}
            loggedInUser={loggedInUser}
            onStatusChange={handleStatusChange}
            onCreateBooking={handleCreateBooking}
          />
        </Tabs.Content>
      </Tabs.Root>

      <Dialog.Root open={showForm} onOpenChange={setShowForm}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <Dialog.Title className="dialog-title">New Inquiry</Dialog.Title>
            <Form.Root onSubmit={handleSubmit}>
              <div className="form-grid">
                <Form.Field name="photographerId">
                  <Form.Label>Photographer</Form.Label>
                  <Select.Root
                    onValueChange={(value) => {
                      setFormData({ ...formData, photographerId: value });
                      loadPackages(value);
                    }}
                  >
                    <Select.Trigger className="select-trigger" />
                    <Select.Portal>
                      <Select.Content>
                        <Select.Viewport>
                          {photographers.map((photographer) => (
                            <Select.Item
                              key={photographer.id}
                              value={photographer.id.toString()}
                            >
                              <Select.ItemText>
                                {photographer.name}
                              </Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </Form.Field>

                <Form.Field name="packageId">
                  <Form.Label>Package</Form.Label>
                  <Select.Root
                    onValueChange={(value) =>
                      setFormData({ ...formData, packageId: value })
                    }
                  >
                    <Select.Trigger className="select-trigger" />
                    <Select.Portal>
                      <Select.Content>
                        <Select.Viewport>
                          {packages.map((pkg) => (
                            <Select.Item key={pkg.id} value={pkg.id.toString()}>
                              <Select.ItemText>{pkg.name}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </Form.Field>

                <Form.Field name="preferredDate">
                  <Form.Label>Preferred Date</Form.Label>
                  <Form.Control asChild>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferredDate: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Control>
                </Form.Field>

                <Form.Field name="eventType">
                  <Form.Label>Event Type</Form.Label>
                  <Form.Control asChild>
                    <input
                      type="text"
                      value={formData.eventType}
                      onChange={(e) =>
                        setFormData({ ...formData, eventType: e.target.value })
                      }
                      required
                    />
                  </Form.Control>
                </Form.Field>

                <Form.Field name="location">
                  <Form.Label>Location</Form.Label>
                  <Form.Control asChild>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      required
                    />
                  </Form.Control>
                </Form.Field>

                <Form.Field name="message">
                  <Form.Label>Message</Form.Label>
                  <Form.Control asChild>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                    />
                  </Form.Control>
                </Form.Field>
              </div>

              <div className="dialog-footer">
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit">Submit Inquiry</button>
              </div>
            </Form.Root>
            <Dialog.Close asChild>
              <button className="close-button">
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function InquiryTable({
  inquiries,
  loggedInUser,
  onStatusChange,
  onCreateBooking,
}) {
  const canManageInquiries =
    loggedInUser?.role === "Admin" || loggedInUser?.role === "Photographer";

  return (
    <table className="inquiry-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Photographer</th>
          <th>Package</th>
          <th>Event Type</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {inquiries.map((inquiry) => (
          <tr key={inquiry.id}>
            <td>{new Date(inquiry.createdAt).toLocaleDateString()}</td>
            <td>{inquiry.photographer.name}</td>
            <td>{inquiry.package.name}</td>
            <td>{inquiry.eventType}</td>
            <td>
              {canManageInquiries ? (
                <Select.Root
                  defaultValue={inquiry.status}
                  onValueChange={(value) => onStatusChange(inquiry.id, value)}
                >
                  <Select.Trigger className="status-select" />
                  <Select.Portal>
                    <Select.Content>
                      <Select.Viewport>
                        <Select.Item value="pending">Pending</Select.Item>
                        <Select.Item value="approved">Approved</Select.Item>
                        <Select.Item value="closed">Closed</Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              ) : (
                <span className={`status-badge ${inquiry.status}`}>
                  {inquiry.status}
                </span>
              )}
            </td>
            <td>
              {canManageInquiries && inquiry.status === "approved" && (
                <button
                  className="create-booking-button"
                  onClick={() => onCreateBooking(inquiry)}
                >
                  Create Booking
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
