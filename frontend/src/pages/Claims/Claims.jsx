import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  ShieldCheck,
  FileText,
  MessageSquare,
  Upload,
  ChevronRight,
  Send,
} from "lucide-react";

const insuranceTypes = [
  "Health Insurance",
  "Motor Insurance",
  "Life Insurance",
  "Property Insurance",
  "Travel Insurance",
  "Other",
];

const issueTypes = [
  "Claim Rejected",
  "Claim Delayed",
  "Claim Under-Settled",
  "No Response from Insurance Company",
  "Other Issue",
];

function Claims() {
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: "",
    email: "",
    phone: "",

    // Address
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",

    // Insurance Details
    insuranceType: "",
    insuranceCompany: "",
    policyNumber: "",

    // Claim Details
    claimNumber: "",
    claimAmount: "",
    issueType: "",
    issueDate: "",

    // Query Details
    issueDescription: "",
    additionalDetails: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Claim Query Data:", formData);
    console.log("Selected File:", selectedFile);

    // Backend integration later
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 sm:py-16">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-100/40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* ================= HEADER ================= */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/70 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm backdrop-blur-xl">
            <FileText className="h-4 w-4" />
            Submit Your Query
          </div>

          <h1 className="text-3xl font-bold text-slate-900 sm:text-5xl">
            Tell Us About Your{" "}
            <span className="text-blue-600">Claim</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Share your insurance claim details with us. Our team will review
            your query and get in touch with you.
          </p>
        </motion.div>

        {/* ================= FORM ================= */}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* =====================================================
              PERSONAL DETAILS
          ===================================================== */}

          <FormSection
            icon={User}
            title="Personal Information"
            description="Please provide your basic contact details."
          >
            <FormGrid>
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />

              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </FormGrid>
          </FormSection>

          {/* =====================================================
              CURRENT ADDRESS
          ===================================================== */}

          <FormSection
            icon={MapPin}
            title="Current Address"
            description="Provide your current residential address."
          >
            <FormGrid>
              <Input
                label="Address Line 1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="House / Flat number, Street"
                required
                fullWidth
              />

              <Input
                label="Address Line 2"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                placeholder="Area / Locality"
                fullWidth
              />

              <Input
                label="Landmark"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="Nearby landmark (Optional)"
              />

              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />

              <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                required
              />

              <Input
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
                required
              />
            </FormGrid>
          </FormSection>

          {/* =====================================================
              INSURANCE DETAILS
          ===================================================== */}

          <FormSection
            icon={ShieldCheck}
            title="Insurance Information"
            description="Tell us about the insurance policy related to your claim."
          >
            <FormGrid>
              <Select
                label="Insurance Type"
                name="insuranceType"
                value={formData.insuranceType}
                onChange={handleChange}
                required
              >
                <option value="">Select insurance type</option>

                {insuranceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>

              <Input
                label="Insurance Company"
                name="insuranceCompany"
                value={formData.insuranceCompany}
                onChange={handleChange}
                placeholder="Enter insurance company name"
                required
              />

              <Input
                label="Policy Number"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleChange}
                placeholder="Enter policy number"
                required
              />
            </FormGrid>
          </FormSection>

          {/* =====================================================
              CLAIM DETAILS
          ===================================================== */}

          <FormSection
            icon={FileText}
            title="Claim Information"
            description="Provide the details of the insurance claim you need help with."
          >
            <FormGrid>
              <Input
                label="Claim Number"
                name="claimNumber"
                value={formData.claimNumber}
                onChange={handleChange}
                placeholder="Enter claim number"
              />

              <Input
                label="Claim Amount"
                name="claimAmount"
                type="number"
                value={formData.claimAmount}
                onChange={handleChange}
                placeholder="Enter claim amount"
              />

              <Select
                label="Issue Type"
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                required
              >
                <option value="">Select issue type</option>

                {issueTypes.map((issue) => (
                  <option key={issue} value={issue}>
                    {issue}
                  </option>
                ))}
              </Select>

              <Input
                label="Issue / Rejection Date"
                name="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={handleChange}
                required
              />
            </FormGrid>
          </FormSection>

          {/* =====================================================
              QUERY DETAILS
          ===================================================== */}

          <FormSection
            icon={MessageSquare}
            title="Describe Your Issue"
            description="Explain your claim issue in detail so our team can understand your case better."
          >
            <FormGrid>
              <TextArea
                label="Describe Your Issue"
                name="issueDescription"
                value={formData.issueDescription}
                onChange={handleChange}
                placeholder="Please explain what happened with your insurance claim..."
                required
              />

              <TextArea
                label="Additional Details"
                name="additionalDetails"
                value={formData.additionalDetails}
                onChange={handleChange}
                placeholder="Any additional information you would like to share..."
              />
            </FormGrid>
          </FormSection>

          {/* =====================================================
              DOCUMENT UPLOAD
          ===================================================== */}

          <FormSection
            icon={Upload}
            title="Supporting Documents"
            description="Upload any document that can help us understand your claim."
          >
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/40 px-6 py-12 text-center transition-all duration-300 hover:border-blue-400 hover:bg-blue-50">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                <Upload className="h-7 w-7" />
              </div>

              <h3 className="mt-5 font-semibold text-slate-900">
                {selectedFile
                  ? selectedFile.name
                  : "Click here to upload a document"}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Supported formats: PDF, JPG, JPEG, PNG
              </p>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {selectedFile && (
              <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedFile.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-sm font-semibold text-red-500 transition-colors hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            )}
          </FormSection>

          {/* ================= SUBMIT ================= */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-between gap-5 rounded-3xl border border-white/80 bg-white/70 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl sm:flex-row sm:p-8"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Ready to Submit Your Query?
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Our team will review your details and contact you soon.
              </p>
            </div>

            <motion.button
              type="submit"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-700"
            >
              Submit Query

              <Send className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </form>
      </div>
    </section>
  );
}

/* =====================================================
   REUSABLE FORM SECTION
===================================================== */

function FormSection({ icon: Icon, title, description, children }) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.5,
      }}
      className="rounded-3xl border border-white/80 bg-white/75 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:p-8"
    >
      {/* Section Header */}

      <div className="mb-7 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {children}
    </motion.section>
  );
}

/* =====================================================
   FORM GRID
===================================================== */

function FormGrid({ children }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {children}
    </div>
  );
}

/* =====================================================
   INPUT
===================================================== */

function Input({
  label,
  fullWidth,
  required,
  ...props
}) {
  return (
    <div
      className={
        fullWidth
          ? "md:col-span-2"
          : ""
      }
    >
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        {...props}
        required={required}
        className="h-12 w-full rounded-xl border border-slate-200 bg-white/80 px-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

/* =====================================================
   SELECT
===================================================== */

function Select({
  label,
  fullWidth,
  required,
  children,
  ...props
}) {
  return (
    <div
      className={
        fullWidth
          ? "md:col-span-2"
          : ""
      }
    >
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <select
        {...props}
        required={required}
        className="h-12 w-full rounded-xl border border-slate-200 bg-white/80 px-4 text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      >
        {children}
      </select>
    </div>
  );
}

/* =====================================================
   TEXTAREA
===================================================== */

function TextArea({
  label,
  required,
  ...props
}) {
  return (
    <div className="md:col-span-2">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <textarea
        {...props}
        required={required}
        rows={5}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm leading-relaxed text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

export default Claims;