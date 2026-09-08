import { useState } from "react";
import {
  FileText,
  Search,
  CheckCircle2,
  Clock3,
  XCircle,
  Eye,
  Download,
} from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";

const documentsData = [
  {
    id: 1,
    documentName: "Vehicle Registration Certificate.pdf",
    documentType: "Vehicle Document",
    userName: "Rahul Sharma",
    queryId: "QRY-1001",
    uploadedOn: "05 Sep 2026",
    status: "pending",
  },
  {
    id: 2,
    documentName: "Insurance Policy.pdf",
    documentType: "Insurance Document",
    userName: "Priya Singh",
    queryId: "QRY-1002",
    uploadedOn: "04 Sep 2026",
    status: "approved",
  },
  {
    id: 3,
    documentName: "Driving License.pdf",
    documentType: "Identity Document",
    userName: "Amit Verma",
    queryId: "QRY-1003",
    uploadedOn: "03 Sep 2026",
    status: "approved",
  },
  {
    id: 4,
    documentName: "Accident Images.zip",
    documentType: "Accident Evidence",
    userName: "Rahul Sharma",
    queryId: "QRY-1001",
    uploadedOn: "02 Sep 2026",
    status: "rejected",
  },
  {
    id: 5,
    documentName: "Claim Application.pdf",
    documentType: "Claim Document",
    userName: "Priya Singh",
    queryId: "QRY-1004",
    uploadedOn: "01 Sep 2026",
    status: "pending",
  },
];

function AdminDocuments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredDocuments = documentsData.filter((document) => {
    const matchesSearch =
      document.documentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      document.userName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      document.queryId
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      document.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalDocuments = documentsData.length;

  const pendingDocuments = documentsData.filter(
    (document) => document.status === "pending"
  ).length;

  const approvedDocuments = documentsData.filter(
    (document) => document.status === "approved"
  ).length;

  const rejectedDocuments = documentsData.filter(
    (document) => document.status === "rejected"
  ).length;

  const getStatusBadge = (status) => {
    if (status === "pending") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
          <Clock3 className="h-3.5 w-3.5" />
          Pending
        </span>
      );
    }

    if (status === "approved") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Approved
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
          <XCircle className="h-3.5 w-3.5" />
          Rejected
        </span>
      );
    }
  };

  return (
    <AdminLayout role="main_admin">

      {/* ================= PAGE HEADER ================= */}

      <div className="mb-8">
        <p className="text-sm font-medium text-slate-500">
          View and manage all uploaded documents
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Documents
        </h1>
      </div>

      {/* ================= STATS ================= */}

      <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Documents
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {totalDocuments}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText className="h-6 w-6" />
            </div>

          </div>
        </div>

        {/* Pending */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Pending Review
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {pendingDocuments}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock3 className="h-6 w-6" />
            </div>

          </div>
        </div>

        {/* Approved */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Approved
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {approvedDocuments}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>

          </div>
        </div>

        {/* Rejected */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Rejected
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {rejectedDocuments}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <XCircle className="h-6 w-6" />
            </div>

          </div>
        </div>

      </div>

      {/* ================= DOCUMENT LIST ================= */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* TOP SECTION */}

        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              All Documents
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review documents uploaded by users
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            {/* SEARCH */}

            <div className="relative">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 sm:w-64"
              />

            </div>

            {/* STATUS FILTER */}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 outline-none transition focus:border-blue-500"
            >

              <option value="all">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="rejected">
                Rejected
              </option>

            </select>

          </div>

        </div>

        {/* ================= TABLE ================= */}

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="border-b border-slate-100 bg-slate-50">

              <tr>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Document
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  User
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Query
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Uploaded
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredDocuments.map((document) => (

                <tr
                  key={document.id}
                  className="border-b border-slate-100 last:border-none transition hover:bg-slate-50/70"
                >

                  {/* DOCUMENT */}

                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <FileText className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">

                        <p className="truncate font-semibold text-slate-900">
                          {document.documentName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {document.documentType}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* USER */}

                  <td className="px-6 py-5">

                    <span className="text-sm font-medium text-slate-700">
                      {document.userName}
                    </span>

                  </td>

                  {/* QUERY */}

                  <td className="px-6 py-5">

                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {document.queryId}
                    </span>

                  </td>

                  {/* UPLOADED */}

                  <td className="px-6 py-5">

                    <span className="text-sm text-slate-600">
                      {document.uploadedOn}
                    </span>

                  </td>

                  {/* STATUS */}

                  <td className="px-6 py-5">
                    {getStatusBadge(document.status)}
                  </td>

                  {/* ACTION */}

                  <td className="px-6 py-5">

                    <div className="flex justify-end gap-2">

                      {/* VIEW */}

                      <button
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        title="View Document"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* DOWNLOAD */}

                      <button
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                        title="Download Document"
                      >
                        <Download className="h-4 w-4" />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {/* ================= EMPTY STATE ================= */}

          {filteredDocuments.length === 0 && (

            <div className="py-16 text-center">

              <FileText className="mx-auto h-10 w-10 text-slate-300" />

              <h3 className="mt-4 font-semibold text-slate-700">
                No documents found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filter.
              </p>

            </div>

          )}

        </div>

      </div>

    </AdminLayout>
  );
}

export default AdminDocuments;