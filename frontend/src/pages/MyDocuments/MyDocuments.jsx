import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  FileImage,
  FileCheck2,
  Eye,
  Download,
  Trash2,
  X,
  Search,
  FolderOpen,
  CheckCircle2,
  Clock3,
} from "lucide-react";

const documents = [
  {
    id: 1,
    name: "Insurance Policy.pdf",
    type: "Policy Document",
    query: "Health Insurance Claim #CLM-1024",
    date: "12 Aug 2026",
    size: "2.4 MB",
    status: "Verified",
    icon: FileText,
  },
  {
    id: 2,
    name: "Hospital Bills.pdf",
    type: "Medical Document",
    query: "Health Insurance Claim #CLM-1024",
    date: "14 Aug 2026",
    size: "4.8 MB",
    status: "Pending",
    icon: FileText,
  },
  {
    id: 3,
    name: "Medical Reports.pdf",
    type: "Medical Document",
    query: "Health Insurance Claim #CLM-1024",
    date: "14 Aug 2026",
    size: "3.2 MB",
    status: "Verified",
    icon: FileCheck2,
  },
  {
    id: 4,
    name: "Vehicle Damage.jpg",
    type: "Supporting Evidence",
    query: "Motor Insurance Claim #CLM-1018",
    date: "20 Aug 2026",
    size: "1.8 MB",
    status: "Pending",
    icon: FileImage,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

function MyDocuments() {
  const [documentList, setDocumentList] = useState(documents);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const verifiedDocuments = documentList.filter(
    (document) => document.status === "Verified"
  ).length;

  const pendingDocuments = documentList.filter(
    (document) => document.status === "Pending"
  ).length;

  const filteredDocuments = documentList.filter((document) =>
    document.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id) => {
    setDocumentList((prev) =>
      prev.filter((document) => document.id !== id)
    );
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 sm:py-16">
      
      {/* Background Decoration */}
      <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-100/40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/70 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm backdrop-blur-xl">
              <FolderOpen className="h-4 w-4" />

              Document Center
            </div>

            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              My{" "}
              <span className="text-blue-600">
                Documents
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Upload, manage and securely access all documents related to
              your insurance claims.
            </p>
          </div>

          {/* Upload Button */}

          <motion.button
            onClick={() => setIsUploadOpen(true)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-700"
          >
            <Upload className="h-5 w-5" />

            Upload Document
          </motion.button>
        </motion.div>


        {/* ================= STATS ================= */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          
          {/* Total */}

          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-white/80 bg-white/70 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Documents
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {documentList.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </motion.div>


          {/* Verified */}

          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-white/80 bg-white/70 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Verified Documents
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {verifiedDocuments}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
          </motion.div>


          {/* Pending */}

          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-white/80 bg-white/70 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pending Verification
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {pendingDocuments}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock3 className="h-6 w-6" />
              </div>
            </div>
          </motion.div>

        </motion.div>


        {/* ================= DOCUMENT SECTION ================= */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-xl shadow-blue-900/5 backdrop-blur-xl"
        >

          {/* Top Section */}

          <div className="flex flex-col gap-5 border-b border-slate-200/70 p-6 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Uploaded Documents
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage documents submitted for your insurance claims.
              </p>
            </div>


            {/* Search */}

            <div className="relative w-full lg:w-80">

              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white/80 pl-11 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />

            </div>

          </div>


          {/* ================= DOCUMENT LIST ================= */}

          <div className="divide-y divide-slate-200/70">

            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((document, index) => {
                const Icon = document.icon;

                return (
                  <motion.div
                    key={document.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                    }}
                    className="group flex flex-col gap-5 p-6 transition-colors hover:bg-blue-50/40 lg:flex-row lg:items-center"
                  >

                    {/* File Icon */}

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <Icon className="h-7 w-7" />
                    </div>


                    {/* File Details */}

                    <div className="min-w-0 flex-1">

                      <h3 className="truncate font-semibold text-slate-900">
                        {document.name}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">

                        <span>
                          {document.type}
                        </span>

                        <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

                        <span>
                          {document.query}
                        </span>

                        <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

                        <span>
                          {document.date}
                        </span>

                      </div>

                    </div>


                    {/* Size */}

                    <div className="text-sm text-slate-500 lg:w-20">
                      {document.size}
                    </div>


                    {/* Status */}

                    <div className="lg:w-32">

                      {document.status === "Verified" ? (

                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">

                          <CheckCircle2 className="h-4 w-4" />

                          Verified

                        </div>

                      ) : (

                        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">

                          <Clock3 className="h-4 w-4" />

                          Pending

                        </div>

                      )}

                    </div>


                    {/* Actions */}

                    <div className="flex items-center gap-2">

                      <button
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        title="View Document"
                      >
                        <Eye className="h-4 w-4" />
                      </button>


                      <button
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        title="Download Document"
                      >
                        <Download className="h-4 w-4" />
                      </button>


                      <button
                        onClick={() =>
                          handleDelete(document.id)
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                        title="Delete Document"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                    </div>

                  </motion.div>
                );
              })
            ) : (

              <div className="flex flex-col items-center justify-center px-6 py-20 text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <FileText className="h-8 w-8" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  No Documents Found
                </h3>

                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  We couldn't find any documents matching your search.
                </p>

              </div>

            )}

          </div>

        </motion.div>

      </div>


      {/* ================= UPLOAD MODAL ================= */}

      <AnimatePresence>

        {isUploadOpen && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              transition={{
                duration: 0.25,
              }}
              className="w-full max-w-lg rounded-3xl border border-white/80 bg-white p-6 shadow-2xl sm:p-8"
            >

              {/* Modal Header */}

              <div className="flex items-start justify-between">

                <div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Upload Document
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Upload documents related to your insurance claim.
                  </p>

                </div>


                <button
                  onClick={() => {
                    setIsUploadOpen(false);
                    setSelectedFile(null);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <X className="h-5 w-5" />
                </button>

              </div>


              {/* Upload Area */}

              <label className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 px-6 py-12 text-center transition-all hover:border-blue-400 hover:bg-blue-50">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">

                  <Upload className="h-7 w-7" />

                </div>


                <h3 className="mt-5 font-semibold text-slate-900">

                  {selectedFile
                    ? selectedFile.name
                    : "Click to upload your document"}

                </h3>


                <p className="mt-2 text-sm text-slate-500">

                  PDF, JPG or PNG files supported

                </p>


                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />

              </label>


              {/* Selected File */}

              {selectedFile && (

                <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-3">

                    <FileText className="h-5 w-5 text-blue-600" />

                    <div>

                      <p className="max-w-[220px] truncate text-sm font-semibold text-slate-800">

                        {selectedFile.name}

                      </p>

                      <p className="text-xs text-slate-500">

                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB

                      </p>

                    </div>

                  </div>


                  <button
                    onClick={() =>
                      setSelectedFile(null)
                    }
                    className="text-sm font-medium text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>

                </div>

              )}


              {/* Buttons */}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  onClick={() => {
                    setIsUploadOpen(false);
                    setSelectedFile(null);
                  }}
                  className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50"
                >
                  Cancel
                </button>


                <button
                  disabled={!selectedFile}
                  className="h-11 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Upload Document
                </button>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </section>
  );
}

export default MyDocuments;