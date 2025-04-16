import NavBar from "@/components/NavBar";
import CreateTicketForm from "@/components/CreateTicketForm";

export default function CreateTicketPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[#0f172a] text-white px-6 py-16 max-w-3xl mx-auto">
        <CreateTicketForm />
      </main>
    </>
  );
}
