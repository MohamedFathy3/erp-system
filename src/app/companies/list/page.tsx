"use client";
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Branch = {
  id: number;
  name: string;
  companyId: number;
  location: string;
  active: boolean;
};

type Company = {
  id: number;
  name: string;
};

const companies: Company[] = [
  { id: 1, name: "Techno Corp" },
  { id: 2, name: "Green Energy" },
  { id: 3, name: "Smart Retail" },
];

const dummyBranches: Branch[] = [
  { id: 1, name: "Cairo Branch", companyId: 1, location: "Cairo", active: true },
  { id: 2, name: "Dubai HQ", companyId: 2, location: "Dubai", active: false },
  { id: 3, name: "Riyadh North", companyId: 3, location: "Riyadh", active: true },
];

export default function BranchesPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const branches = dummyBranches.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalBranches = dummyBranches.length;
  const totalCompaniesWithBranches = new Set(dummyBranches.map((b) => b.companyId)).size;

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Branch Saved (dummy mode) 🚀");
    setOpen(false);
    setEditingBranch(null);
  };

  return (
    <MainLayout>
      <div className="space-y-8 p-6">
        {/* Cards Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-300">
            <h2 className="text-lg font-medium">Total Branches</h2>
            <p className="text-4xl font-bold mt-2">{totalBranches}</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-300">
            <h2 className="text-lg font-medium">Companies with Branches</h2>
            <p className="text-4xl font-bold mt-2">{totalCompaniesWithBranches}</p>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Branches</h1>
          <Button
            className="bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
            onClick={() => { setEditingBranch(null); setOpen(true); }}
          >
            + Add Branch
          </Button>
        </div>

        {/* Search */}
        <Input
          placeholder="Search branches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md text-black dark:text-gray-100 rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:placeholder-gray-400"
        />

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {["Branch", "Company", "Location", "Status", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-gray-700 dark:text-gray-300 font-medium uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
              {branches.length ? (
                branches.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-gray-100">{b.name}</td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                      {companies.find((c) => c.id === b.companyId)?.name}
                    </td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{b.location}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${b.active ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}`}>
                        {b.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-3 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setEditingBranch(b); setOpen(true); }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => alert("Delete (dummy mode)")}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No branches found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md p-6 relative transform scale-95 animate-fadeIn">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 text-xl font-bold"
              >
                ✖
              </button>
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                {editingBranch ? "Edit Branch" : "Add Branch"}
              </h2>
              <form className="space-y-4" onSubmit={handleSave}>
                <Input
                  name="name"
                  placeholder="Branch Name"
                  defaultValue={editingBranch?.name}
                  required
                  className="rounded-xl dark:bg-gray-800 dark:text-gray-100"
                />
                <select
                  name="companyId"
                  defaultValue={editingBranch?.companyId || ""}
                  className="w-full border rounded-xl p-2 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                  required
                >
                  <option value="">Select Company</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <Input
                  name="location"
                  placeholder="Location"
                  defaultValue={editingBranch?.location}
                  className="rounded-xl dark:bg-gray-800 dark:text-gray-100"
                />
                <label className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={editingBranch?.active}
                    className="accent-indigo-600"
                  />
                  <span>Active</span>
                </label>
                <Button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all rounded-xl">
                  Save
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
