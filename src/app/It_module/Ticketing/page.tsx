import MainLayout from "@/components/MainLayout";

export default function TicketingPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Ticketing Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your ticketing system settings
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
