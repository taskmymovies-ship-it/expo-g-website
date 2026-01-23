import AdminLayout from "@/components/admin/AdminLayout";
import { adminNavLinks } from "@/data/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

const editors = [
  { name: "Hero", href: "/admin/hero", desc: "Hero content and navigation." },
  {
    name: "Reviews / Moments",
    href: "/admin/reviews",
    desc: "What is ICE Exhibitions section.",
  },
  {
    name: "Brand Highlights",
    href: "/admin/brand-editor",
    desc: "Partner brands showcase (BrandEditor).",
  },
  {
    name: "Celebrities",
    href: "/admin/celebrities",
    desc: "Celebrity highlights (CelebEditor).",
  },
  {
    name: "Gallery Items",
    href: "/admin/gallery",
    desc: "Gallery highlights and filters.",
  },
  {
    name: "Entrance Arches",
    href: "/admin/arches",
    desc: "Mega entrance arches (ArchesEditor).",
  },
  {
    name: "Stalls Mosaic",
    href: "/admin/stalls",
    desc: "Stalls mosaic images and stats (StallsEditor).",
  },
  {
    name: "Buyer Mosaic",
    href: "/admin/buyer-mosaic",
    desc: "Buyer mosaic images and stats (BuyerMosaicEditor).",
  },
  {
    name: "VVIP Spotlight",
    href: "/admin/vvips",
    desc: "VVIP guests and highlights (VvipEditor).",
  },
  {
    name: "Sellers",
    href: "/admin/seller-editor",
    desc: "Seller signals section (SellerEditor).",
  },
  {
    name: "Buyers",
    href: "/admin/buyer-editor",
    desc: "Buyer voices section (BuyerEditor).",
  },
  {
    name: "Founders Editor",
    href: "/admin/founder-editor",
    desc: "Founders spotlight (FoundersEditor).",
  },
  {
    name: "Co-founders Editor",
    href: "/admin/cofounder-editor",
    desc: "Co-founders spotlight (CoFoundersEditor).",
  },
  {
    name: "Counts",
    href: "/admin/counts",
    desc: "Homepage stats strip (CountEditor).",
  },
  {
    name: "Dual CTA",
    href: "/admin/dual-cta",
    desc: "Sellers & buyers dual CTA (DualCtaEditor).",
  },
  {
    name: "Timeline",
    href: "/admin/timeline",
    desc: "Journey timeline milestones (TimelineEditor).",
  },
  {
    name: "Dual CTA / Partner CTA",
    href: "/admin/partner",
    desc: "Partner CTA content.",
  },
  { name: "Sponsor CTA", href: "/admin/sponsor", desc: "Sponsor CTA content." },
  {
    name: "Footer",
    href: "/admin/footer",
    desc: "Footer CTA, links, contact.",
  },
];

const AdminEditors = () => {
  const navigate = useNavigate();
  return (
    <AdminLayout
      title="Editor Navigation"
      description="Open any section editor directly."
      navItems={adminNavLinks.map((item) => ({
        label: item.name,
        href: item.href,
      }))}
      sections={[{ id: "editors", label: "Editors" }]}
    >
      <Card id="editors" className="bg-card/70 border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Editors
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {editors.map((item) => (
            <div
              key={item.href}
              className="rounded-xl border border-border/50 bg-background/60 p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">{item.name}</div>
                <Badge variant="outline">Open</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(item.href)}
              >
                Open
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminEditors;
