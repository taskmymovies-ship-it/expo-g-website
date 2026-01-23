import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminNavLinks } from "@/data/admin";
import BuyerEditor, { type BuyersData } from "@/components/admin/sections/BuyerEditor";

const emptyBuyers: BuyersData = {
  eyebrow: "",
  title: "",
  description: "",
  ctaLabel: "",
  ctaHref: "",
  buyers: [],
};

const createId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `buyer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const AdminBuyerEditor = () => {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const [data, setData] = useState<BuyersData>(emptyBuyers);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("admin_refresh_token");
    if (!refreshToken) return null;
    const res = await fetch(`${base}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      localStorage.removeItem("admin_access_token");
      localStorage.removeItem("admin_refresh_token");
      return null;
    }
    const tokenData = await res.json();
    if (tokenData.accessToken) {
      localStorage.setItem("admin_access_token", tokenData.accessToken);
      return tokenData.accessToken as string;
    }
    return null;
  };

  const getAccessToken = async () => {
    const token = localStorage.getItem("admin_access_token");
    if (token) return token;
    return refreshAccessToken();
  };

  type NoticeType = "success" | "error";

const [notice, setNotice] = useState<{
  type: NoticeType;
  message: string;
} | null>(null);

const showNotice = (type: NoticeType, message: string) => {
  setNotice({ type, message });
  setTimeout(() => setNotice(null), 3000);
};


  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${base}/buyers`);
      if (!res.ok) throw new Error("Failed to load buyers");
      const payload = await res.json();
      setData({ ...emptyBuyers, ...(payload || {}), buyers: payload?.buyers || [] });
    } catch {
      setData(emptyBuyers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
  setSaving(true);
  try {
    const token = await getAccessToken();
    if (!token) throw new Error("Not authenticated");

    const attempt = async (authToken: string | null) =>
      fetch(`${base}/buyers`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(data),
      });

    let res = await attempt(token);

    if (res && res.status === 401) {
      const refreshed = await refreshAccessToken();
      res = await attempt(refreshed);
    }

    if (!res || !res.ok) throw new Error("Save failed");

    showNotice("success", " Saved successfully");
  } catch (err) {
    console.error(err);
    showNotice("error", "Save failed");
  } finally {
    setSaving(false);
  }
};

  const restore = async () => {
  setSaving(true);
  try {
    const token = await getAccessToken();
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${base}/buyers/restore`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Restore failed");

    await load();
    showNotice("success", "Restored Successfully");
  } catch (err) {
    console.error(err);
    showNotice("error", "Restore failed");
  } finally {
    setSaving(false);
  }
};

  return (
    <AdminLayout
      title="Buyer Voices"
      description="Manage buyer testimonials and CTA content."
      navItems={adminNavLinks}
      sections={[{ id: "buyers", label: "Buyers" }]}
    >
    {notice && (
  <div
    className={`mb-6 rounded-lg px-4 py-3 text-sm flex items-center gap-2
      ${
        notice.type === "success"
          ? "bg-blue-50 text-blue-700"
          : "bg-red-50 text-red-700"
      }`}
  >
    <span className="font-medium">
      {notice.type === "success" ? "✓" : "⚠"}
    </span>
    {notice.message}
  </div>
)}
      <BuyerEditor
        data={data}
        onChange={setData}
        onAdd={() =>
          setData((prev) => ({
            ...prev,
            buyers: [...(prev.buyers || []), { id: createId(), name: "", city: "", segment: "", quote: "", spend: "", visits: "", image: "", href: "" }],
          }))
        }
        onRemove={(idx) =>
          setData((prev) => ({
            ...prev,
            buyers: (prev.buyers || []).filter((_, i) => i !== idx),
          }))
        }
        onSave={save}
        onRestore={restore}
        saving={saving}
        loading={loading}
      />
    </AdminLayout>
  );
};

export default AdminBuyerEditor;
