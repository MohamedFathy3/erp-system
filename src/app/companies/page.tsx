"use client";
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Company = {
  id: number;
  name: string;
  created_at: string;
  hq: string;
  branches: number;
  active: boolean;
};

const dummyCompanies: Company[] = [
  { id: 1, name: "Techno Corp", created_at: "2023-02-15", hq: "Cairo", branches: 3, active: true },
  { id: 2, name: "Green Energy", created_at: "2022-09-10", hq: "Dubai", branches: 1, active: false },
  { id: 3, name: "Smart Retail", created_at: "2021-05-20", hq: "Riyadh", branches: 5, active: true },
];

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const companies = dummyCompanies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalCompanies = dummyCompanies.length;
  const totalWithBranches = dummyCompanies.filter((c) => c.branches > 0).length;

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Form submitted (dummy mode) 🚀");
    setOpen(false);
    setEditingCompany(null);
  };

  return (
    <MainLayout>
      <div className="space-y-8 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-300">
            <h2 className="text-lg font-medium">Total Companies</h2>
            <p className="text-4xl font-bold mt-2">{totalCompanies}</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-300">
            <h2 className="text-lg font-medium">Companies with Branches</h2>
            <p className="text-4xl font-bold mt-2">{totalWithBranches}</p>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Companies</h1>
          <Button
            className="bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
            onClick={() => {
              setEditingCompany(null);
              setOpen(true);
            }}
          >
            + Add Company
          </Button>
        </div>

        {/* Search */}
        <Input
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md text-black dark:text-gray-100 rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:placeholder-gray-400"
        />

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {["Name", "Registered", "HQ", "Branches", "Status", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-gray-700 dark:text-gray-300 font-medium uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
              {companies.length ? (
                companies.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-gray-100">{c.name}</td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{c.hq}</td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{c.branches}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${c.active ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}`}>
                        {c.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-3 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCompany(c);
                          setOpen(true);
                        }}
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
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No companies found
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
                {editingCompany ? "Edit Company" : "Add Company"}
              </h2>
              <form className="space-y-4" onSubmit={handleSave}>
                <Input
                  name="name"
                  placeholder="Company Name"
                  defaultValue={editingCompany?.name}
                  required
                  className="rounded-xl dark:bg-gray-800 dark:text-gray-100"
                />
                <Input
                  name="hq"
                  placeholder="Headquarters"
                  defaultValue={editingCompany?.hq}
                  className="rounded-xl dark:bg-gray-800 dark:text-gray-100"
                />
                <Input
                  name="branches"
                  type="number"
                  placeholder="Number of branches"
                  defaultValue={editingCompany?.branches}
                  className="rounded-xl dark:bg-gray-800 dark:text-gray-100"
                />
                <label className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={editingCompany?.active}
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
