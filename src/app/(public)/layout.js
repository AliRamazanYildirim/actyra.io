import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <NavBar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
