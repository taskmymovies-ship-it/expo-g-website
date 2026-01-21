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
  const [successMsg, setSuccessMsg] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("pageSize", "24");
      // const res = await fetch(`${base}/brands/highlights`);
      // const res = await fetch(`${base}/brands?page=1&pageSize=200`);
      const res = await fetch(`${base}/brands?page=1&pageSize=200&sort=oldest`);
      const heroRes = await fetch(`${base}/brands/hero`);
      const payload = await res.json();
      const hero = heroRes.ok ? await heroRes.json() : {};
      setData({
        eyebrow: hero?.badge || "",
        title: hero?.title || "",
        description: hero?.subheading || "",
        ctaLabel: hero?.ctaLabel || "",
        ctaHref: hero?.ctaHref || "/brands",
        brands: payload?.data || [],
      });
    } catch {
      setData(emptyBrands);
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

  // const save = async () => {
  //   setLoading(true);
  //   try {
  //     const headers = getAuthHeaders();

  //     // 1️⃣ Save hero section
  //     await fetch(`${base}/brands/hero`, {
  //       method: "PUT",
  //       headers,
  //       body: JSON.stringify({
  //         badge: data.eyebrow,
  //         title: data.title,
  //         subtitle: data.description,
  //         ctaLabel: data.ctaLabel,
  //         ctaHref: data.ctaHref,
  //       }),
  //     });

  //     // 2️⃣ Save brands list
  //     // await fetch(`${base}/brands/highlights`, {
  //     //   method: "PUT",
  //     //   headers,
  //     //   body: JSON.stringify(data.brands),
  //     // });

  //     await Promise.all(
  //       data.brands.map((brand) =>
  //         fetch(`${base}/brands/${brand.slug}`, {
  //           method: "PUT",
  //           headers,
  //           body: JSON.stringify(brand),
  //         }),
  //       ),
  //     );

  //     // 3️⃣ Reload fresh data
  //     await load();
  //   } catch (err) {
  //     console.error("Save failed", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
      setSuccessMsg("Brands saved successfully ✅");

      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (err) {
      console.error("Save failed", err);
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

    // Also delete from backend
    if (brand.slug) {
      const headers = getAuthHeaders();
      await fetch(`${base}/brands/${brand.slug}`, {
        method: "DELETE",
        headers,
      });
    }
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
      <BrandEditor
        successMsg={successMsg}
        data={data}
        onChange={setData}
        // onAddBrand={() =>
        //   setData({
        //     ...data,
        //     brands: [
        //       ...(data.brands || []),
        //       {
        //         slug: "",
        //         name: "",
        //         logo: "",
        //         relationship: "",
        //         category: "",
        //         image: "",
        //       },
        //     ],
        //   })
        // }
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
                summary: "",
                detail: {
                  headline: "",
                  summary: "",
                  heroImage: "",
                  highlights: [],
                  metrics: [],
                  pullQuote: "",
                  ctaLabel: "",
                  ctaHref: "",
                  impactDescription: "",
                },
              },
            ],
          })
        }
        onRemoveBrand={(idx) => deleteBrand(idx)}
        onSave={() => save()}
        onRestore={() => {}}
        saving={false}
        loading={loading}
      />
    </AdminLayout>
  );
};

export default AdminBrandEditor;
