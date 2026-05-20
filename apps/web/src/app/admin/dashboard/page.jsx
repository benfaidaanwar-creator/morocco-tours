import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  Image,
  CreditCard,
  MessageSquare,
  Settings,
  LogOut,
  DollarSign,
  Eye,
  AlertCircle,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Save,
  CheckCircle,
  Link as LinkIcon,
} from "lucide-react";
import useUpload from "../../../utils/useUpload";
import { toast } from "sonner";

const TABS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "bookings", label: "Bookings", icon: CalendarCheck },
  { key: "offers", label: "Offers", icon: Package },
  { key: "contacts", label: "Messages", icon: MessageSquare },
  { key: "gallery", label: "Gallery", icon: Image },
  { key: "images", label: "Site Images", icon: Image },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "settings", label: "Settings", icon: Settings },
];

const STATUS_COLORS = {
  new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  confirmed: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  completed: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const queryClient = useQueryClient();

  const [offerModal, setOfferModal] = useState(null);
  const [galleryModal, setGalleryModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("ecl-admin-token");
    if (!token) window.location.href = "/admin";
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("ecl-admin-token");
    localStorage.removeItem("ecl-admin-user");
    window.location.href = "/admin";
  }, []);

  const { data: dashboardData } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const { data: bookingsData } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: activeTab === "bookings",
  });

  const { data: offersData = [] } = useQuery({
    queryKey: ["admin-offers"],
    queryFn: async () => {
      const res = await fetch("/api/offers?active=false");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: activeTab === "offers",
  });

  const { data: contactsData = [] } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: async () => {
      const res = await fetch("/api/contact");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: activeTab === "contacts",
  });

  const { data: galleryData = [] } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const res = await fetch("/api/gallery?active=false");
      if (!res.ok) return [];
      return res.json();
    },
    enabled: activeTab === "gallery",
  });

  const { data: siteImages = {} } = useQuery({
    queryKey: ["admin-images"],
    queryFn: async () => {
      const res = await fetch("/api/admin/images");
      if (!res.ok) return {};
      return res.json();
    },
    enabled: activeTab === "images",
  });

  const { data: paymentData = [] } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const res = await fetch("/api/payment-methods");
      if (!res.ok) return [];
      return res.json();
    },
    enabled: activeTab === "payments",
  });

  const { data: siteSettings = {} } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) return {};
      return res.json();
    },
    enabled: activeTab === "settings",
  });

  const updateBookingStatus = useCallback(
    async (id, status) => {
      try {
        const res = await fetch(`/api/bookings/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ booking_status: status }),
        });
        if (res.ok) {
          queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
          queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
          toast.success("Status updated");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to update status");
      }
    },
    [queryClient],
  );

  const stats = dashboardData?.stats || {};
  const cardClass =
    "rounded-xl border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A] bg-white p-5";

  return (
    <div className="min-h-screen dark:bg-[#0A0A0A] bg-[#F9FAFB] flex">
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 dark:bg-[#111111] bg-white border-r dark:border-white/10 border-gray-200 z-40 transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-5 border-b dark:border-white/10 border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#C8A96E] flex items-center justify-center">
              <span className="text-white font-semibold text-sm font-inter">
                EC
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold dark:text-white text-gray-900 font-inter">
                Erg Chebbi
              </p>
              <p className="text-xs dark:text-white/40 text-gray-400 font-inter">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium font-inter transition-colors ${
                  isActive
                    ? "bg-[#C8A96E]/10 text-[#C8A96E]"
                    : "dark:text-white/60 text-gray-600 hover:dark:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t dark:border-white/10 border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium font-inter dark:text-white/40 text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg dark:bg-[#1A1A1A] bg-white border dark:border-white/10 border-gray-200"
      >
        <LayoutDashboard size={20} className="dark:text-white text-gray-900" />
      </button>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold dark:text-white text-gray-900 font-inter">
              {TABS.find((t) => t.key === activeTab)?.label}
            </h1>
            <p className="text-sm dark:text-white/40 text-gray-500 font-inter mt-1">
              Manage your Erg Chebbi Luxury business
            </p>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Bookings",
                    value: stats.totalBookings || 0,
                    icon: CalendarCheck,
                    color: "text-blue-500",
                  },
                  {
                    label: "Revenue",
                    value: `€${(stats.totalRevenue || 0).toFixed(0)}`,
                    icon: DollarSign,
                    color: "text-green-500",
                  },
                  {
                    label: "New Bookings",
                    value: stats.newBookings || 0,
                    icon: AlertCircle,
                    color: "text-yellow-500",
                  },
                  {
                    label: "Total Visitors",
                    value: stats.totalVisitors || 0,
                    icon: Eye,
                    color: "text-purple-500",
                  },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className={cardClass}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium dark:text-white/40 text-gray-500 font-inter uppercase tracking-wider">
                          {stat.label}
                        </span>
                        <Icon size={18} className={stat.color} />
                      </div>
                      <p className="text-2xl font-semibold dark:text-white text-gray-900 font-inter">
                        {stat.value}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={cardClass}>
                  <span className="text-xs font-medium dark:text-white/40 text-gray-500 font-inter">
                    Confirmed
                  </span>
                  <p className="text-lg font-semibold text-green-500 font-inter mt-1">
                    {stats.confirmedBookings || 0}
                  </p>
                </div>
                <div className={cardClass}>
                  <span className="text-xs font-medium dark:text-white/40 text-gray-500 font-inter">
                    Unread Messages
                  </span>
                  <p className="text-lg font-semibold text-[#C8A96E] font-inter mt-1">
                    {stats.unreadContacts || 0}
                  </p>
                </div>
                <div className={cardClass}>
                  <span className="text-xs font-medium dark:text-white/40 text-gray-500 font-inter">
                    Today's Visitors
                  </span>
                  <p className="text-lg font-semibold dark:text-white text-gray-900 font-inter mt-1">
                    {stats.todayVisitors || 0}
                  </p>
                </div>
              </div>

              <div className={cardClass}>
                <h3 className="text-base font-semibold dark:text-white text-gray-900 font-inter mb-4">
                  Recent Bookings
                </h3>
                <div className="space-y-3">
                  {(dashboardData?.recentBookings || [])
                    .slice(0, 5)
                    .map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between py-2 border-b dark:border-white/5 border-gray-100 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium dark:text-white text-gray-900 font-inter">
                            {b.full_name}
                          </p>
                          <p className="text-xs dark:text-white/40 text-gray-400 font-inter">
                            {b.offer_title || b.category} · €{b.estimated_total}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full border text-xs font-medium font-inter ${STATUS_COLORS[b.booking_status] || STATUS_COLORS.new}`}
                        >
                          {b.booking_status}
                        </span>
                      </div>
                    ))}
                  {(!dashboardData?.recentBookings ||
                    dashboardData.recentBookings.length === 0) && (
                    <p className="text-sm dark:text-white/30 text-gray-400 font-inter text-center py-4">
                      No bookings yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className={cardClass}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-inter">
                  <thead>
                    <tr className="border-b dark:border-white/10 border-gray-200">
                      <th className="text-left py-3 px-2 text-xs font-medium dark:text-white/40 text-gray-500 uppercase tracking-wider">
                        Guest
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-medium dark:text-white/40 text-gray-500 uppercase tracking-wider">
                        Offer
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-medium dark:text-white/40 text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-medium dark:text-white/40 text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-medium dark:text-white/40 text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-medium dark:text-white/40 text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(bookingsData?.bookings || []).map((b) => (
                      <tr
                        key={b.id}
                        className="border-b dark:border-white/5 border-gray-50"
                      >
                        <td className="py-3 px-2">
                          <p className="font-medium dark:text-white text-gray-900">
                            {b.full_name}
                          </p>
                          <p className="text-xs dark:text-white/40 text-gray-400">
                            {b.email}
                          </p>
                        </td>
                        <td className="py-3 px-2 dark:text-white/60 text-gray-600">
                          {b.offer_title || b.category || "-"}
                        </td>
                        <td className="py-3 px-2 font-medium text-[#C8A96E]">
                          €{b.estimated_total || 0}
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-0.5 rounded-full border text-xs font-medium ${STATUS_COLORS[b.booking_status] || STATUS_COLORS.new}`}
                          >
                            {b.booking_status}
                          </span>
                        </td>
                        <td className="py-3 px-2 dark:text-white/40 text-gray-400 text-xs">
                          {new Date(b.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2">
                          <select
                            value={b.booking_status}
                            onChange={(e) =>
                              updateBookingStatus(b.id, e.target.value)
                            }
                            className="text-xs px-2 py-1 rounded border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white text-gray-900 font-inter"
                          >
                            <option value="new">New</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!bookingsData?.bookings ||
                  bookingsData.bookings.length === 0) && (
                  <p className="text-sm dark:text-white/30 text-gray-400 font-inter text-center py-8">
                    No bookings yet
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "offers" && (
            <OffersTab
              offers={offersData}
              cardClass={cardClass}
              onEdit={(offer) => setOfferModal({ mode: "edit", data: offer })}
              onCreate={() => setOfferModal({ mode: "create", data: {} })}
              queryClient={queryClient}
            />
          )}

          {activeTab === "contacts" && (
            <div className="space-y-3">
              {contactsData.map((msg) => (
                <div
                  key={msg.id}
                  className={`${cardClass} ${!msg.is_read ? "border-l-2 border-l-[#C8A96E]" : ""}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold dark:text-white text-gray-900 font-inter">
                        {msg.sender_name}
                      </p>
                      <p className="text-xs dark:text-white/40 text-gray-400 font-inter">
                        {msg.email} {msg.phone ? `· ${msg.phone}` : ""}
                      </p>
                    </div>
                    <span className="text-xs dark:text-white/30 text-gray-400 font-inter">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {msg.subject && (
                    <p className="text-sm font-medium dark:text-white/70 text-gray-700 font-inter mb-1">
                      {msg.subject}
                    </p>
                  )}
                  <p className="text-sm dark:text-white/50 text-gray-500 font-inter">
                    {msg.message}
                  </p>
                </div>
              ))}
              {contactsData.length === 0 && (
                <p className="text-sm dark:text-white/30 text-gray-400 font-inter text-center py-8">
                  No messages yet
                </p>
              )}
            </div>
          )}

          {activeTab === "gallery" && (
            <GalleryTab
              gallery={galleryData}
              onUpload={() => setGalleryModal(true)}
              queryClient={queryClient}
            />
          )}

          {activeTab === "images" && (
            <SiteImagesTab
              images={siteImages}
              cardClass={cardClass}
              queryClient={queryClient}
            />
          )}

          {activeTab === "payments" && (
            <PaymentsTab
              payments={paymentData}
              cardClass={cardClass}
              onEdit={(pm) => setPaymentModal(pm)}
            />
          )}

          {activeTab === "settings" && (
            <SettingsTab
              settings={siteSettings}
              cardClass={cardClass}
              queryClient={queryClient}
            />
          )}
        </div>
      </main>

      {offerModal && (
        <OfferModal
          modal={offerModal}
          onClose={() => setOfferModal(null)}
          queryClient={queryClient}
        />
      )}
      {galleryModal && (
        <GalleryUploadModal
          onClose={() => setGalleryModal(false)}
          queryClient={queryClient}
        />
      )}
      {paymentModal && (
        <PaymentModal
          payment={paymentModal}
          onClose={() => setPaymentModal(null)}
          queryClient={queryClient}
        />
      )}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function OffersTab({ offers, cardClass, onEdit, onCreate, queryClient }) {
  const deleteOfferMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
      toast.success("Offer deleted");
    },
    onError: () => toast.error("Failed to delete offer"),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm dark:text-white/50 text-gray-500 font-inter">
          Manage your service offerings
        </p>
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8A96E] text-white rounded-lg hover:bg-[#B8955E] transition-colors text-sm font-inter"
        >
          <Plus size={16} /> Add Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((offer) => (
          <div key={offer.id} className={cardClass}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <span className="px-2 py-0.5 rounded-full bg-[#C8A96E]/10 text-[#C8A96E] text-xs font-medium font-inter">
                  {offer.category}
                </span>
                <h3 className="text-base font-semibold dark:text-white text-gray-900 font-inter mt-2">
                  {offer.title_en}
                </h3>
                <p className="text-xs dark:text-white/40 text-gray-400 font-inter">
                  {offer.subtitle_en}
                </p>
              </div>
              <span className="text-lg font-semibold text-[#C8A96E] font-inter">
                €{offer.price}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs dark:text-white/40 text-gray-400 font-inter">
                {offer.is_active ? (
                  <span className="text-green-500 flex items-center gap-1">
                    <CheckCircle size={12} /> Active
                  </span>
                ) : (
                  <span className="text-red-500">Inactive</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(offer)}
                  className="p-1.5 rounded hover:bg-[#C8A96E]/10 text-[#C8A96E] transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete this offer?"))
                      deleteOfferMutation.mutate(offer.id);
                  }}
                  className="p-1.5 rounded hover:bg-red-500/10 text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {offers.length === 0 && (
        <p className="text-sm dark:text-white/30 text-gray-400 font-inter text-center py-8">
          No offers yet. Click "Add Offer" to create one.
        </p>
      )}
    </div>
  );
}

function GalleryTab({ gallery, onUpload, queryClient }) {
  const deleteGalleryMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      toast.success("Image deleted");
    },
    onError: () => toast.error("Failed to delete image"),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm dark:text-white/50 text-gray-500 font-inter">
          Manage gallery images
        </p>
        <button
          onClick={onUpload}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8A96E] text-white rounded-lg hover:bg-[#B8955E] transition-colors text-sm font-inter"
        >
          <Upload size={16} /> Upload Image
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((img) => (
          <div
            key={img.id}
            className="rounded-xl border dark:border-white/10 border-gray-200 overflow-hidden group relative"
          >
            <img
              src={img.image_url}
              alt={img.caption || "Gallery"}
              className="w-full aspect-square object-cover"
            />
            <button
              onClick={() => {
                if (confirm("Delete this image?"))
                  deleteGalleryMutation.mutate(img.id);
              }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
            <div className="p-2">
              <p className="text-xs dark:text-white/50 text-gray-500 font-inter truncate">
                {img.caption || img.category || "Uncategorized"}
              </p>
            </div>
          </div>
        ))}
      </div>
      {gallery.length === 0 && (
        <p className="text-sm dark:text-white/30 text-gray-400 font-inter text-center py-8">
          No gallery images yet. Click "Upload Image" to add.
        </p>
      )}
    </div>
  );
}

function SiteImagesTab({ images, cardClass, queryClient }) {
  const [form, setForm] = useState(images);
  const [upload, { loading: uploading }] = useUpload();
  const [uploadingKey, setUploadingKey] = useState(null);

  useEffect(() => {
    setForm(images);
  }, [images]);

  const imageFields = [
    {
      key: "image_hero_1",
      label: "Hero Background 1",
      description: "Main homepage hero image",
    },
    {
      key: "image_hero_2",
      label: "Hero Background 2",
      description: "Alternate hero image",
    },
    {
      key: "image_hero_3",
      label: "Hero Background 3",
      description: "Third hero image",
    },
    {
      key: "image_about_bg",
      label: "About Page Background",
      description: "Background for about page",
    },
    {
      key: "image_camp_bg",
      label: "Camp Page Background",
      description: "Background for luxury camp page",
    },
    {
      key: "image_camel_bg",
      label: "Camel Tours Background",
      description: "Background for camel tours page",
    },
    {
      key: "image_quad_bg",
      label: "Quad/ATV Background",
      description: "Background for quad/ATV page",
    },
    {
      key: "image_transfer_bg",
      label: "Transfer Background",
      description: "Background for transfer page",
    },
    {
      key: "image_gallery_bg",
      label: "Gallery Page Background",
      description: "Background for gallery page",
    },
    {
      key: "image_booking_bg",
      label: "Booking Page Background",
      description: "Background for booking page",
    },
  ];

  const updateImagesMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/admin/images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-images"] });
      toast.success("Images updated");
    },
    onError: () => toast.error("Failed to update images"),
  });

  const handleImageUpload = async (key, file) => {
    if (!file) return;
    setUploadingKey(key);
    const { url, error } = await upload({ file });
    if (error) {
      toast.error("Image upload failed");
      setUploadingKey(null);
      return;
    }
    setForm((p) => ({ ...p, [key]: url }));
    setUploadingKey(null);
  };

  const handleSave = () => {
    updateImagesMutation.mutate(form);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold dark:text-white text-gray-900 font-inter">
            Manage Site Images
          </h3>
          <p className="text-sm dark:text-white/50 text-gray-500 font-inter">
            Upload or paste image URLs for different sections
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={updateImagesMutation.isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8A96E] text-white rounded-lg hover:bg-[#B8955E] transition-colors text-sm font-inter disabled:opacity-50"
        >
          <Save size={16} /> Save All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {imageFields.map((field) => (
          <div key={field.key} className={cardClass}>
            <div className="mb-3">
              <h4 className="text-sm font-semibold dark:text-white text-gray-900 font-inter">
                {field.label}
              </h4>
              <p className="text-xs dark:text-white/40 text-gray-400 font-inter">
                {field.description}
              </p>
            </div>

            {form[field.key] && (
              <div className="mb-3">
                <img
                  src={form[field.key]}
                  alt={field.label}
                  className="w-full h-32 object-cover rounded-lg border dark:border-white/10 border-gray-200"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x200?text=Invalid+Image";
                  }}
                />
              </div>
            )}

            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter flex items-center gap-1">
                  <LinkIcon size={12} /> Image URL
                </label>
                <input
                  type="text"
                  value={form[field.key] || ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [field.key]: e.target.value }))
                  }
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white text-gray-900 text-sm font-inter"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-200 dark:bg-white/10"></div>
                <span className="text-xs dark:text-white/40 text-gray-400 font-inter">
                  or
                </span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-white/10"></div>
              </div>

              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(field.key, e.target.files?.[0])
                  }
                  disabled={uploadingKey === field.key}
                  className="hidden"
                />
                <div className="w-full px-3 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white/60 text-gray-600 text-sm font-inter text-center cursor-pointer hover:border-[#C8A96E] transition-colors flex items-center justify-center gap-2">
                  <Upload size={14} />
                  {uploadingKey === field.key ? "Uploading..." : "Upload Image"}
                </div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentsTab({ payments, cardClass, onEdit }) {
  return (
    <div className="space-y-3">
      {payments.map((pm) => (
        <div key={pm.id} className={cardClass}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold dark:text-white text-gray-900 font-inter">
                {pm.method_name}
              </p>
              <p className="text-xs dark:text-white/40 text-gray-400 font-inter mt-0.5">
                Type: {pm.method_type}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium font-inter ${pm.is_active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
              >
                {pm.is_active ? "Active" : "Inactive"}
              </span>
              <button
                onClick={() => onEdit(pm)}
                className="p-1.5 rounded hover:bg-[#C8A96E]/10 text-[#C8A96E] transition-colors"
              >
                <Pencil size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
      {payments.length === 0 && (
        <p className="text-sm dark:text-white/30 text-gray-400 font-inter text-center py-8">
          No payment methods configured
        </p>
      )}
    </div>
  );
}

function SettingsTab({ settings, cardClass, queryClient }) {
  const [form, setForm] = useState(settings);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      toast.success("Settings updated");
    },
    onError: () => toast.error("Failed to update settings"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettingsMutation.mutate(form);
  };

  return (
    <div className={cardClass}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-base font-semibold dark:text-white text-gray-900 font-inter mb-4">
          Site Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
              Hero Headline (EN)
            </label>
            <input
              type="text"
              value={form.hero_headline_en || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, hero_headline_en: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white text-gray-900 text-sm font-inter"
            />
          </div>
          <div>
            <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
              WhatsApp Number
            </label>
            <input
              type="text"
              value={form.whatsapp_number || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, whatsapp_number: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white text-gray-900 text-sm font-inter"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
            Hero Subtitle (EN)
          </label>
          <textarea
            value={form.hero_subtitle_en || ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, hero_subtitle_en: e.target.value }))
            }
            rows="3"
            className="w-full px-3 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white text-gray-900 text-sm font-inter resize-none"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C8A96E] text-white rounded-lg hover:bg-[#B8955E] text-sm font-inter"
        >
          <Save size={14} /> Save Settings
        </button>
      </form>
    </div>
  );
}

function OfferModal({ modal, onClose, queryClient }) {
  const [form, setForm] = useState(modal.data);
  const [upload, { loading: uploading }] = useUpload();

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (modal.mode === "create") {
        const res = await fetch("/api/offers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed");
        return res.json();
      } else {
        const res = await fetch(`/api/offers/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed");
        return res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
      onClose();
      toast.success(
        modal.mode === "create" ? "Offer created" : "Offer updated",
      );
    },
    onError: () => toast.error("Failed to save offer"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { url, error } = await upload({ file });
    if (error) {
      toast.error("Image upload failed");
      return;
    }
    setForm((p) => ({ ...p, image_url: url }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A] bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold dark:text-white text-gray-900 font-inter">
            {modal.mode === "create" ? "Create Offer" : "Edit Offer"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/5"
          >
            <X size={20} className="dark:text-white/60 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
                Category *
              </label>
              <select
                value={form.category || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value }))
                }
                required
                className="w-full px-3 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white text-gray-900 text-sm font-inter"
              >
                <option value="">Select...</option>
                <option value="camp">Camp</option>
                <option value="camel">Camel</option>
                <option value="quad">Quad</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
                Price (EUR) *
              </label>
              <input
                type="number"
                step="0.01"
                value={form.price || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, price: e.target.value }))
                }
                required
                className="w-full px-3 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white text-gray-900 text-sm font-inter"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
              Title (English) *
            </label>
            <input
              type="text"
              value={form.title_en || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, title_en: e.target.value }))
              }
              required
              className="w-full px-3 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white text-gray-900 text-sm font-inter"
            />
          </div>

          <div>
            <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
              Subtitle (English)
            </label>
            <input
              type="text"
              value={form.subtitle_en || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, subtitle_en: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white text-gray-900 text-sm font-inter"
            />
          </div>

          <div>
            <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
              Description (English)
            </label>
            <textarea
              value={form.description_en || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, description_en: e.target.value }))
              }
              rows="3"
              className="w-full px-3 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white text-gray-900 text-sm font-inter resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
              Duration
            </label>
            <input
              type="text"
              placeholder="e.g. 2 Hours"
              value={form.duration || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, duration: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white text-gray-900 text-sm font-inter"
            />
          </div>

          <div>
            <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
              Included Features (separate with |)
            </label>
            <textarea
              value={form.included_features_en || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, included_features_en: e.target.value }))
              }
              rows="2"
              placeholder="Camel ride|Sunset|Dinner|Breakfast"
              className="w-full px-3 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white text-gray-900 text-sm font-inter resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
              Image URL or Upload
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={form.image_url || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, image_url: e.target.value }))
                }
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white text-gray-900 text-sm font-inter"
              />
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-sm flex-1"
                  disabled={uploading}
                />
                {form.image_url && (
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={form.is_active !== false}
              onChange={(e) =>
                setForm((p) => ({ ...p, is_active: e.target.checked }))
              }
              className="rounded"
            />
            <label
              htmlFor="active"
              className="text-sm dark:text-white text-gray-900 font-inter"
            >
              Active
            </label>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t dark:border-white/10 border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border dark:border-white/20 border-gray-300 dark:text-white text-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-sm font-inter"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || mutation.isLoading}
              className="flex-1 px-4 py-2 bg-[#C8A96E] text-white rounded-lg hover:bg-[#B8955E] text-sm font-inter disabled:opacity-50"
            >
              <Save size={14} className="inline mr-2" />
              {modal.mode === "create" ? "Create" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function GalleryUploadModal({ onClose, queryClient }) {
  const [form, setForm] = useState({
    image_url: "",
    category: "",
    caption: "",
  });
  const [upload, { loading: uploading }] = useUpload();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      onClose();
      toast.success("Image added to gallery");
    },
    onError: () => toast.error("Failed to add image"),
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { url, error } = await upload({ file });
    if (error) {
      toast.error("Image upload failed");
      return;
    }
    setForm((p) => ({ ...p, image_url: url }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A] bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold dark:text-white text-gray-900 font-inter">
            Upload Image
          </h2>
          <button onClick={onClose}>
            <X size={20} className="dark:text-white/60 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
              Image URL or Upload *
            </label>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) =>
                setForm((p) => ({ ...p, image_url: e.target.value }))
              }
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white text-gray-900 text-sm font-inter mb-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full text-sm"
            />
            {form.image_url && (
              <img
                src={form.image_url}
                alt="Preview"
                className="mt-3 w-full h-48 object-cover rounded"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white text-gray-900 text-sm font-inter"
            >
              <option value="">All</option>
              <option value="camp">Camp</option>
              <option value="camel">Camel</option>
              <option value="quad">Quad</option>
              <option value="desert">Desert</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
              Caption
            </label>
            <input
              type="text"
              value={form.caption}
              onChange={(e) =>
                setForm((p) => ({ ...p, caption: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white text-gray-900 text-sm font-inter"
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border dark:border-white/20 border-gray-300 rounded-lg text-sm font-inter"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !form.image_url || mutation.isLoading}
              className="flex-1 px-4 py-2 bg-[#C8A96E] text-white rounded-lg text-sm font-inter disabled:opacity-50"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PaymentModal({ payment, onClose, queryClient }) {
  const [form, setForm] = useState(payment);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`/api/payment-methods/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_active: data.is_active,
          method_name: data.method_name,
          details: data.details,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
      onClose();
      toast.success("Payment method updated");
    },
    onError: () => toast.error("Failed to update payment method"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border dark:border-white/10 border-gray-200 dark:bg-[#1A1A1A] bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold dark:text-white text-gray-900 font-inter">
            Edit Payment Method
          </h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 font-inter">
              Method Name
            </label>
            <input
              type="text"
              value={form.method_name}
              onChange={(e) =>
                setForm((p) => ({ ...p, method_name: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white dark:text-white text-gray-900 text-sm font-inter"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pm-active"
              checked={form.is_active}
              onChange={(e) =>
                setForm((p) => ({ ...p, is_active: e.target.checked }))
              }
            />
            <label
              htmlFor="pm-active"
              className="text-sm dark:text-white text-gray-900 font-inter"
            >
              Active
            </label>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg text-sm font-inter"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="flex-1 px-4 py-2 bg-[#C8A96E] text-white rounded-lg text-sm font-inter disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
