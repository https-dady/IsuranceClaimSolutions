import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  ShieldCheck,
  FileText,
  MessageSquare,
  Upload,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { createQuery } from "../../api/queryApi";
import { getMyProfile } from "../../api/profileApi";
import { useAuth } from "../../context/AuthContext";

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

const documentTypes = [
  "Insurance Policy Document",
  "Claim Form / Claim Reference",
  "ID Proof",
  "Relevant Bills / Receipts",
  "Rejection Letter / Communication",
  "Other Supporting Documents",
];

const MAX_FILE_SIZE = 1 * 1024 * 1024;

const allowedFileTypes = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

function Claims() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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

  const [documents, setDocuments] = useState([]);

  const [isLoadingProfile, setIsLoadingProfile] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [submittedQueryId, setSubmittedQueryId] =
    useState("");

  /*
  =========================================================
  LOAD LOGGED-IN USER PROFILE
  =========================================================
  */

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    const loadProfile = async () => {
      try {
        setIsLoadingProfile(true);
        setError("");

        const response = await getMyProfile();

        const profile = response?.profile;

        if (!profile) {
          throw new Error(
            "Unable to load your profile details."
          );
        }

        setFormData((prev) => ({
          ...prev,

          fullName:
            profile.name || prev.fullName,

          email:
            profile.email || prev.email,

          phone:
            profile.phone || prev.phone,
        }));
      } catch (err) {
        console.error(
          "Failed to load profile:",
          err
        );

        if (err?.status === 401) {
          navigate("/login", {
            replace: true,
          });

          return;
        }

        setError(
          err?.message ||
            "Unable to load your profile. Please try again."
        );
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, navigate]);

  /*
  =========================================================
  HANDLE INPUT CHANGE
  =========================================================
  */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  /*
  =========================================================
  HANDLE DOCUMENT FILE CHANGE
  =========================================================
  */

  const handleFileChange = (event) => {
    const files = Array.from(
      event.target.files || []
    );

    if (files.length === 0) {
      return;
    }

    setError("");
    setSuccess("");

    const newDocuments = [];

    for (const file of files) {
      /*
      -----------------------------------------------------
      FILE TYPE VALIDATION
      -----------------------------------------------------
      */

      if (
        !allowedFileTypes.includes(
          file.type
        )
      ) {
        setError(
          `${file.name} is not a supported file type. Please upload PDF, JPG, JPEG, or PNG.`
        );

        continue;
      }

      /*
      -----------------------------------------------------
      FILE SIZE VALIDATION
      Backend limit = 1 MB
      -----------------------------------------------------
      */

      if (file.size > MAX_FILE_SIZE) {
        setError(
          `${file.name} is larger than 1 MB. Please choose a smaller file.`
        );

        continue;
      }

      /*
      -----------------------------------------------------
      DUPLICATE FILE CHECK
      -----------------------------------------------------
      */

      const alreadyExists =
        documents.some(
          (document) =>
            document.file.name ===
              file.name &&
            document.file.size ===
              file.size
        ) ||
        newDocuments.some(
          (document) =>
            document.file.name ===
              file.name &&
            document.file.size ===
              file.size
        );

      if (alreadyExists) {
        continue;
      }

      newDocuments.push({
        file,
        documentType: "",
      });
    }

    if (newDocuments.length > 0) {
      setDocuments((prev) => [
        ...prev,
        ...newDocuments,
      ]);
    }

    /*
    -----------------------------------------------------
    RESET INPUT
    -----------------------------------------------------
    */

    event.target.value = "";
  };

  /*
  =========================================================
  CHANGE DOCUMENT TYPE
  =========================================================
  */

  const handleDocumentTypeChange = (
    index,
    value
  ) => {
    setDocuments((prev) =>
      prev.map((document, documentIndex) =>
        documentIndex === index
          ? {
              ...document,
              documentType: value,
            }
          : document
      )
    );

    setError("");
  };

  /*
  =========================================================
  REMOVE DOCUMENT
  =========================================================
  */

  const removeDocument = (index) => {
    setDocuments((prev) =>
      prev.filter(
        (_, documentIndex) =>
          documentIndex !== index
      )
    );

    setError("");
  };

  /*
  =========================================================
  FORMAT FILE SIZE
  =========================================================
  */

  const formatFileSize = (bytes) => {
    if (!bytes) {
      return "0 KB";
    }

    const sizeInKB = bytes / 1024;

    if (sizeInKB < 1024) {
      return `${sizeInKB.toFixed(1)} KB`;
    }

    return `${(
      sizeInKB / 1024
    ).toFixed(2)} MB`;
  };

  /*
  =========================================================
  VALIDATE FORM
  =========================================================
  */

  const validateForm = () => {
    const requiredFields = [
      {
        key: "fullName",
        label: "Full Name",
      },
      {
        key: "email",
        label: "Email Address",
      },
      {
        key: "phone",
        label: "Phone Number",
      },
      {
        key: "addressLine1",
        label: "Address Line 1",
      },
      {
        key: "city",
        label: "City",
      },
      {
        key: "state",
        label: "State",
      },
      {
        key: "pincode",
        label: "Pincode",
      },
      {
        key: "insuranceType",
        label: "Insurance Type",
      },
      {
        key: "insuranceCompany",
        label: "Insurance Company",
      },
      {
        key: "policyNumber",
        label: "Policy Number",
      },
      {
        key: "claimNumber",
        label: "Claim Number",
      },
      {
        key: "claimAmount",
        label: "Claim Amount",
      },
      {
        key: "issueType",
        label: "Issue Type",
      },
      {
        key: "issueDate",
        label: "Issue / Rejection Date",
      },
      {
        key: "issueDescription",
        label: "Issue Description",
      },
    ];

    for (const field of requiredFields) {
      if (
        !String(
          formData[field.key] || ""
        ).trim()
      ) {
        return `${field.label} is required.`;
      }
    }

    /*
    -------------------------------------------------------
    CLAIM AMOUNT
    -------------------------------------------------------
    */

    const claimAmount = Number(
      formData.claimAmount
    );

    if (
      Number.isNaN(claimAmount) ||
      claimAmount < 0
    ) {
      return "Please enter a valid claim amount.";
    }

    /*
    -------------------------------------------------------
    DOCUMENT TYPE VALIDATION
    -------------------------------------------------------
    */

    for (const document of documents) {
      if (
        !document.documentType
      ) {
        return `Please select a document type for ${document.file.name}.`;
      }
    }

    return "";
  };

  /*
  =========================================================
  SUBMIT QUERY
  =========================================================
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSubmittedQueryId("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    try {
      setIsSubmitting(true);

      /*
      -----------------------------------------------------
      PREPARE DOCUMENT DATA
      -----------------------------------------------------
      */

      const files = documents.map(
        (document) =>
          document.file
      );

      const uploadedDocumentTypes =
        documents.map(
          (document) =>
            document.documentType
        );

      /*
      -----------------------------------------------------
      CREATE QUERY
      -----------------------------------------------------
      */

      const response =
        await createQuery({
          personalDetails: {
            fullName:
              formData.fullName.trim(),

            email:
              formData.email.trim(),

            phone:
              formData.phone.trim(),
          },

          address: {
            addressLine1:
              formData.addressLine1.trim(),

            addressLine2:
              formData.addressLine2.trim(),

            landmark:
              formData.landmark.trim(),

            city:
              formData.city.trim(),

            state:
              formData.state.trim(),

            pincode:
              formData.pincode.trim(),
          },

          insuranceDetails: {
            insuranceType:
              formData.insuranceType,

            insuranceCompany:
              formData.insuranceCompany.trim(),

            policyNumber:
              formData.policyNumber.trim(),
          },

          claimDetails: {
            claimNumber:
              formData.claimNumber.trim(),

            claimAmount:
              Number(
                formData.claimAmount
              ),

            issueType:
              formData.issueType,

            issueDate:
              formData.issueDate,
          },

          queryDetails: {
            issueDescription:
              formData.issueDescription.trim(),

            additionalDetails:
              formData.additionalDetails.trim(),
          },

          files,

          documentTypes:
            uploadedDocumentTypes,
        });

      /*
      -----------------------------------------------------
      SUCCESS
      -----------------------------------------------------
      */

      const queryId =
        response?.query?.queryId;

      setSubmittedQueryId(
        queryId || ""
      );

      setSuccess(
        response?.message ||
          "Query submitted successfully."
      );

      /*
      -----------------------------------------------------
      CLEAR DOCUMENTS
      -----------------------------------------------------
      */

      setDocuments([]);

      /*
      -----------------------------------------------------
      RESET FORM EXCEPT USER DETAILS
      -----------------------------------------------------
      */

      setFormData((prev) => ({
        ...prev,

        addressLine1: "",
        addressLine2: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",

        insuranceType: "",
        insuranceCompany: "",
        policyNumber: "",

        claimNumber: "",
        claimAmount: "",
        issueType: "",
        issueDate: "",

        issueDescription: "",
        additionalDetails: "",
      }));

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(
        "Claim submission failed:",
        err
      );

      if (err?.status === 401) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      setError(
        err?.message ||
          "Unable to submit your query. Please try again."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
  =========================================================
  LOADING PROFILE
  =========================================================
  */

  if (isLoadingProfile) {
    return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-100/40 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />

          <p className="text-sm font-medium text-slate-600">
            Loading your profile...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 sm:py-16">
      {/* Background Glow */}

      <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-100/40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mb-10 text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/70 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm backdrop-blur-xl">
            <FileText className="h-4 w-4" />

            Submit Your Query
          </div>

          <h1 className="text-3xl font-bold text-slate-900 sm:text-5xl">
            Tell Us About Your{" "}
            <span className="text-blue-600">
              Claim
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Share your insurance claim details with us.
            Our team will review your query and get in
            touch with you.
          </p>
        </motion.div>

        {/* ================= SUCCESS ================= */}

        {success && (
          <motion.div
            initial={{
              opacity: 0,
              y: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />

              <div>
                <h3 className="font-bold text-emerald-800">
                  Query Submitted Successfully
                </h3>

                <p className="mt-1 text-sm text-emerald-700">
                  {success}
                </p>

                {submittedQueryId && (
                  <p className="mt-2 text-sm font-bold text-emerald-800">
                    Query ID:{" "}
                    {submittedQueryId}
                  </p>
                )}

                {submittedQueryId && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/my-queries/${submittedQueryId}`
                      )
                    }
                    className="mt-4 inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    View Query
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= ERROR ================= */}

        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />

              <div>
                <h3 className="font-bold text-red-800">
                  Unable to Submit Query
                </h3>

                <p className="mt-1 text-sm leading-relaxed text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
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
                <option value="">
                  Select insurance type
                </option>

                {insuranceTypes.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  )
                )}
              </Select>

              <Input
                label="Insurance Company"
                name="insuranceCompany"
                value={
                  formData.insuranceCompany
                }
                onChange={handleChange}
                placeholder="Enter insurance company name"
                required
              />

              <Input
                label="Policy Number"
                name="policyNumber"
                value={
                  formData.policyNumber
                }
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
                value={
                  formData.claimNumber
                }
                onChange={handleChange}
                placeholder="Enter claim number"
                required
              />

              <Input
                label="Claim Amount"
                name="claimAmount"
                type="number"
                min="0"
                value={
                  formData.claimAmount
                }
                onChange={handleChange}
                placeholder="Enter claim amount"
                required
              />

              <Select
                label="Issue Type"
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select issue type
                </option>

                {issueTypes.map(
                  (issue) => (
                    <option
                      key={issue}
                      value={issue}
                    >
                      {issue}
                    </option>
                  )
                )}
              </Select>

              <Input
                label="Issue / Rejection Date"
                name="issueDate"
                type="date"
                value={
                  formData.issueDate
                }
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
                value={
                  formData.issueDescription
                }
                onChange={handleChange}
                placeholder="Please explain what happened with your insurance claim..."
                required
              />

              <TextArea
                label="Additional Details"
                name="additionalDetails"
                value={
                  formData.additionalDetails
                }
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
            {/* DOCUMENT GUIDANCE */}

            <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Helpful documents you can provide
                  </p>

                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    Upload relevant documents such as your
                    insurance policy, claim form, ID proof,
                    bills, rejection letter, or other supporting
                    documents.
                  </p>
                </div>
              </div>
            </div>

            {/* UPLOAD AREA */}

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/40 px-6 py-12 text-center transition-all duration-300 hover:border-blue-400 hover:bg-blue-50">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                <Upload className="h-7 w-7" />
              </div>

              <h3 className="mt-5 font-semibold text-slate-900">
                Click here to upload documents
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Supported formats: PDF, JPG, JPEG, PNG
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Maximum file size: 1 MB per document
              </p>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* DOCUMENT LIST */}

            {documents.length > 0 && (
              <div className="mt-5 space-y-4">
                {documents.map(
                  (
                    document,
                    documentIndex
                  ) => (
                    <div
                      key={`${document.file.name}-${documentIndex}`}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        {/* FILE INFO */}

                        <div className="flex min-w-0 flex-1 items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                            <FileText className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <p className="break-all text-sm font-semibold text-slate-800">
                              {document.file.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {formatFileSize(
                                document.file.size
                              )}
                            </p>
                          </div>
                        </div>

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() =>
                            removeDocument(
                              documentIndex
                            )
                          }
                          disabled={
                            isSubmitting
                          }
                          className="inline-flex items-center justify-center gap-1.5 self-start rounded-lg px-3 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />

                          Remove
                        </button>
                      </div>

                      {/* DOCUMENT TYPE */}

                      <div className="mt-4">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Document Type
                          <span className="ml-1 text-red-500">
                            *
                          </span>
                        </label>

                        <select
                          value={
                            document.documentType
                          }
                          onChange={(event) =>
                            handleDocumentTypeChange(
                              documentIndex,
                              event.target.value
                            )
                          }
                          disabled={
                            isSubmitting
                          }
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="">
                            Select document type
                          </option>

                          {documentTypes.map(
                            (type) => (
                              <option
                                key={type}
                                value={type}
                              >
                                {type}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </FormSection>

          {/* ================= SUBMIT ================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="flex flex-col items-center justify-between gap-5 rounded-3xl border border-white/80 bg-white/70 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl sm:flex-row sm:p-8"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Ready to Submit Your Query?
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Our team will review your details and contact
                you soon.
              </p>

              {documents.length > 0 && (
                <p className="mt-2 text-xs font-medium text-blue-600">
                  {documents.length} document
                  {documents.length > 1
                    ? "s"
                    : ""}{" "}
                  selected
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              whileHover={{
                y: isSubmitting ? 0 : -2,
              }}
              whileTap={{
                scale: isSubmitting ? 1 : 0.97,
              }}
              disabled={
                isSubmitting
              }
              className="inline-flex h-12 min-w-[160px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />

                  Submitting...
                </>
              ) : (
                <>
                  Submit Query

                  <Send className="h-4 w-4" />
                </>
              )}
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

function FormSection({
  icon: Icon,
  title,
  description,
  children,
}) {
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