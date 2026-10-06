import Footer from "@/components/shared/Footer";
import PublicHeader from "@/components/shared/PublicHeader";

export default function MainLayout({children}:{children:React.ReactNode}) {
  return <><PublicHeader/><main className="ql-global-floral-stage">{children}</main><Footer/></>;
}
