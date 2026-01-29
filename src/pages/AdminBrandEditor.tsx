import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminNavLinks } from "@/data/admin";
import BrandEditor, {
  type BrandsData,
  type BrandItem,
} from "@/components/admin/sections/BrandEditor";

const emptyBrands: BrandsData = {
  eyebrow: "",
  title: "",
  description: "",
  ctaLabel: "",
  ctaHref: "/brands",
  brands: [],
};

// type BrandsResponse = {
//   data: BrandItem[];
// };

const AdminBrandEditor = () => {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const [data, setData] = useState<BrandsData>(emptyBrands);
  const [loading, setLoading] = useState(false);
  // Notification Popup
  type NoticeType = "success" | "error";

  const [notice, setNotice] = useState<{
    type: NoticeType;
    message: string;
  } | null>(null);

  const showNotice = (type: NoticeType, message: string) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 3000);
  };

  // const load = async () => {
  //   setLoading(true);
  //   try {
  //     const params = new URLSearchParams();
  //     params.set("page", "1");
  //     params.set("pageSize", "24");
  //     // const res = await fetch(`${base}/brands/highlights`);
  //     // const res = await fetch(`${base}/brands?page=1&pageSize=200`);
  //     const res = await fetch(`${base}/brands?page=1&pageSize=200&sort=oldest`);
  //     const heroRes = await fetch(`${base}/brands/hero`);
  //     const payload = await res.json();
  //     const hero = heroRes.ok ? await heroRes.json() : {};
  //     setData({
  //       eyebrow: hero?.badge || "",
  //       title: hero?.title || "",
  //       description: hero?.subheading || "",
  //       ctaLabel: hero?.ctaLabel || "",
  //       ctaHref: hero?.ctaHref || "/brands",
  //       brands: payload?.data || [],
  //     });
  //   } catch {
  //     setData(emptyBrands);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const load = async () => {
    setLoading(true);
    try {
      // 1. Load all brands (full data)
      const allRes = await fetch(
        `${base}/brands?page=1&pageSize=200&sort=oldest`,
      );
      const allPayload = await allRes.json();
      const allBrands = allPayload?.data || [];

      // 2. Load highlights (which brands are active)
      const highlightsRes = await fetch(`${base}/brands/highlights`);
      const highlights = await highlightsRes.json();
      const highlighted = highlights?.brands || [];

      // 3. Match by slug
      const highlightedSlugs = new Set(highlighted.map((b: any) => b.slug));

      const merged = allBrands.filter((b: any) => highlightedSlugs.has(b.slug));

      // 4. Load hero
      const heroRes = await fetch(`${base}/brands/hero`);
      const hero = heroRes.ok ? await heroRes.json() : {};

      // setData({
      //   eyebrow: hero?.badge || "",
      //   title: hero?.title || "",
      //   description: hero?.subheading || "",
      //   ctaLabel: highlights?.ctaLabel || "",
      //   ctaHref: highlights?.ctaHref || "/brands",
      //   brands: merged,
      // });
      setData({
        eyebrow: highlights?.eyebrow || "",
        title: highlights?.title || "",
        description: highlights?.description || "",
        ctaLabel: highlights?.ctaLabel || "",
        ctaHref: highlights?.ctaHref || "/brands",
        brands: merged,
      });
    } finally {
      setLoading(false);
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("admin_access_token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const save = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();

      // 1️⃣ Save hero
      await fetch(`${base}/brands/hero`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          badge: data.eyebrow,
          title: data.title,
          subheading: data.description,
          ctaLabel: data.ctaLabel,
          ctaHref: data.ctaHref,
        }),
      });

      // 2️⃣ Save highlights section
      await fetch(`${base}/brands/highlights`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          eyebrow: data.eyebrow,
          title: data.title,
          description: data.description,
          ctaLabel: data.ctaLabel,
          ctaHref: data.ctaHref,
          brands: data.brands,
        }),
      });

      // 3️⃣ Save each brand detail page
      await Promise.all(
        data.brands.map((brand) =>
          fetch(`${base}/brands/${brand.slug}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(brand),
          }),
        ),
      );

      await load();
      showNotice("success", "Saved successfully");
    } catch (err) {
      console.error("Save failed", err);
      showNotice("error", "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const restore = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();

      const res = await fetch(`${base}/brands/highlights/restore`, {
        method: "POST",
        headers,
        body: JSON.stringify({}),
      });

      if (!res.ok) throw new Error("Restore failed");

      await load();
      showNotice("success", "Restored successfully");
    } catch (err) {
      console.error(err);
      showNotice("error", "Restore failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteBrand = async (idx) => {
    const brand = data.brands[idx];

    // Remove from UI immediately
    setData({
      ...data,
      brands: data.brands.filter((_, i) => i !== idx),
    });
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminLayout
      title="Brand Highlights (Editor only)"
      description="Quick view of the Brand Highlights editor. Use Brand Management page to persist changes."
      navItems={adminNavLinks.map((item) => ({
        label: item.name,
        href: item.href,
      }))}
      sections={[{ id: "brands", label: "Brand Highlights" }]}
    >
      <div className="text-sm text-muted-foreground mb-4">
        This inline editor is for reference; saving/restoring is disabled. Go to
        Brand Management to persist changes.
      </div>
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
      <BrandEditor
        data={data}
        onChange={setData}
        onAddBrand={() =>
          setData({
            ...data,
            brands: [
              ...(data.brands || []),
              {
                slug: "",
                name: "",
                logo: "",
                relationship: "",
                category: "",
                image: "",
              },
            ],
          })
        }
        // onAddBrand={() =>
        //   setData((prev) => ({
        //     ...prev,
        //     brands: [
        //       ...(prev.brands || []),
        //       {
        //         slug: "",
        //         name: "",
        //         logo: "",
        //         relationship: "",
        //         category: "",
        //         image: "",
        //         variants: [],
        //         summary: "",
        //         detail: {
        //           headline: "",
        //           summary: "",
        //           heroImage: "",
        //           heroVariants: [],
        //           highlights: [],
        //           metrics: [],
        //           pullQuote: "",
        //           ctaLabel: "",
        //           ctaHref: "",
        //           impactDescription: "",
        //         },
        //       },
        //     ],
        //   }))
        // }
        onRemoveBrand={(idx) => deleteBrand(idx)}
        onSave={() => save()}
        onRestore={() => restore()}
        saving={false}
        loading={loading}
      />
    </AdminLayout>
  );
};

export default AdminBrandEditor;
