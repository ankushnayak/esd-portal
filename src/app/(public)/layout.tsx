import { PublicFooter } from "@/components/layout/public-footer";
import { PublicNavbar } from "@/components/layout/public-navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(18,56,115,0.07),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(25,169,116,0.10),_transparent_24%),linear-gradient(180deg,_#f8fbff_0%,_#ffffff_20%,_#f8fafc_100%)]">
      <PublicNavbar />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
