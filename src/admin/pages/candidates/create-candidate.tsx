import type React from "react"
import { useEffect, useState } from "react"
import { X, Upload, User } from "lucide-react"
import {
  Input,
  Button,
  Spinner,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogActions,
  Label,
  tokens,
} from "@fluentui/react-components"
import { getItems } from "../../../utils"
import {
  Toaster,
  useToastController,
  Toast,
  ToastTitle,
} from "@fluentui/react-components"
import { useId } from "@fluentui/react-utilities"
import axiosInstance from "../../../axiosInstance"
import { Link } from "react-router-dom"
import { useRecruitment } from "../../../context/RecruitmentContext"
import { JobPostingItem } from "./types"

export interface ContactFormData {
  firstname: string
  lastname: string
  email: string
  phone: string
  jobtitle: string
  campaign: string
  currentsalary: string
  expectedsalary: string
  yearsofexperience: string
  city: string
  cv: File | null
  Communication_Skills: string | null
}

interface CreateContactModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (contactData: ContactFormData) => Promise<void>
  theme: "light" | "dark"
}

const CreateContactModal: React.FC<CreateContactModalProps> = ({ isOpen, onClose, onSubmit, theme }) => {
  const [contactForm, setContactForm] = useState<ContactFormData>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    jobtitle: "",
    campaign: "",
    currentsalary: "",
    expectedsalary: "",
    yearsofexperience: '',
    city: "",
    cv: null,
    Communication_Skills: null
  })
  const [email, setEmail] = useState<string | null>(null)
  const [searching, setSearching] = useState<boolean>(false)
  const [users, setUsers] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await onSubmit(contactForm)
      dispatchToast(
        <Toast>
          <ToastTitle>Candidate Added successfully!</ToastTitle>
        </Toast>,
        { intent: "success" }
      )
      setContactForm({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        jobtitle: "",
        campaign: "",
        currentsalary: "",
        expectedsalary: "",
        yearsofexperience: '',
        city: "",
        cv: null,
        Communication_Skills: ''
      })
      onClose()
    } catch (error) {
      console.error("Error creating contact:", error)
      alert("Error creating contact. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a PDF, DOC, or DOCX file")
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB")
        return
      }
      setContactForm((prev) => ({ ...prev, cv: file }))
    }
  }

  const handleClose = () => {
    if (!submitting) {
      onClose()
    }
  }

  const cardBg = theme === "dark" ? "rgba(17, 24, 39, 0.95)" : "rgba(255, 255, 255, 1)"
  const borderColor = theme === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"

  const [jobTitles, setJobTitles] = useState<string[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [loadingTitles, setLoadingTitles] = useState(false)
  const [loadingSkills, setLoadingSkills] = useState(false)
  const { getRecruitmentIds } = useRecruitment()

  useEffect(() => {
    const fetchJobTitles = async () => {
      try {
        setLoadingTitles(true)
        const IDs = await getRecruitmentIds();
        if (!IDs) return
        const response = await getItems(IDs.siteId, IDs.lists.find((list: any) => list.name === 'JobPosting')?.id || '')
        const titles = response && Array.isArray(response.fields)
          ? response.fields.map((item: { fields: JobPostingItem }) => item.fields?.job_title).filter(Boolean)
          : []
        setJobTitles(titles)
      } catch (error) {
        console.error("Error fetching job titles:", error)
      } finally {
        setLoadingTitles(false)
      }
    }
    const fetchCommunicationSkills = async () => {
      try {
        setLoadingSkills(true)
        const IDs = await getRecruitmentIds();
        if (!IDs) return
        const response = await getItems(IDs.siteId, IDs.lists.find((list: any) => list.name === 'communication_skills')?.id || '')
        const skills = response && Array.isArray(response.fields)
          ? response.fields.map((item: any) => item.fields?.Title).filter(Boolean)
          : []
        setSkills(skills)
      } catch (error) {
        console.error("Error fetching communication skills:", error)
      } finally {
        setLoadingSkills(false)
      }
    }

    fetchCommunicationSkills()
    fetchJobTitles()
  }, [getRecruitmentIds])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const fetchUser = async () => {
    try {
      setSearching(true)
      const IDs = await getRecruitmentIds();
      if (!IDs) return
      const userFound = await axiosInstance.get(`/sites/${IDs.siteId}/lists/${IDs.lists.find((list: any) => list.name === 'CvLibrary')?.id}/items?$expand=fields&$filter=fields/email eq '${email}'`)
      setUsers(userFound.data.value || [])
      userFound.data.value?.map((e: any) => {
        setContactForm((prev) => ({
          ...prev,
          firstname: e.fields.CandidateName?.split(' ')[0] === 'Not Provided' ? '' : (e.fields.CandidateName?.split(' ')[0] || ''),
          lastname: e.fields.CandidateName?.split(' ').slice(1).join(' ') === 'Not Provided' ? '' : (e.fields.CandidateName?.split(' ').slice(1).join(' ') || ''),
          email: e.fields.email === 'Not Provided' ? '' : (e.fields.email || ''),
          phone: e.fields.phone === 'Not Provided' ? '' : (e.fields.phone || ''),
          jobtitle: e.fields.jobtitle === 'Not Provided' ? '' : (e.fields.jobtitle || ''),
          currentsalary: e.fields.currentsalary === 'Not Provided' ? '' : (e.fields.currentsalary || ''),
          expectedsalary: e.fields.expectedsalary === 'Not Provided' ? '' : (e.fields.expectedsalary || ''),
          yearsofexperience: e.fields.yearsofexperience === 'Not Provided' ? '' : (e.fields.yearsofexperience || ''),
          city: e.fields.city === 'Not Provided' ? '' : (e.fields.city || ''),
        }))
      })
    } catch (error) {
      console.error("Error fetching user:", error)
      dispatchToast(
        <Toast>
          <ToastTitle>Error checking email</ToastTitle>
        </Toast>,
        { intent: "error" }
      )
    } finally {
      setSearching(false)
    }
  }

  useEffect(() => {
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSearching(true)
      const debounce = setTimeout(() => {
        fetchUser()
      }, 500)
      return () => clearTimeout(debounce)
    } else {
      setUsers([])
      setSearching(false)
    }
  }, [email])

  const toasterId = useId("toaster")
  const { dispatchToast } = useToastController(toasterId)

  if (!isOpen) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogSurface
          style={{
            background: cardBg,
            borderRadius: "1rem",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            border: `1px solid ${borderColor}`,
            maxWidth: "500px",
            width: "90vw",
            maxHeight: "90vh",
            padding: '0',
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: tokens.colorBrandBackground,
              padding: "1.5rem",
              borderRadius: "1rem 1rem 0 0",
              flexShrink: 0,
            }}
          >
            <DialogTitle
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: 0,
                color: "white",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <User style={{ width: 20, height: 20, color: "white" }} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>Create New Candidate</h3>
              </div>
              <Button
                appearance="subtle"
                onClick={handleClose}
                disabled={submitting}
                style={{
                  color: "white",
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: "50%",
                  padding: "8px",
                  minWidth: "auto",
                }}
              >
                <X style={{ width: 18, height: 18 }} />
              </Button>
            </DialogTitle>
          </div>

          <DialogContent
            style={{
              padding: "1.5rem",
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <Label
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                      marginBottom: "0.5rem",
                      display: "block",
                    }}
                  >
                    First Name *
                  </Label>
                  <Input
                    value={contactForm.firstname}
                    onChange={(e: any) => setContactForm((prev) => ({ ...prev, firstname: e.target.value }))}
                    placeholder="Enter first name"
                    disabled={submitting}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      border: `1px solid ${borderColor}`,
                      background: theme === "dark" ? "rgba(255,255,255,0.05)" : "white",
                      color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                    }}
                  />
                </div>
                <div>
                  <Label
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                      marginBottom: "0.5rem",
                      display: "block",
                    }}
                  >
                    Last Name *
                  </Label>
                  <Input
                    value={contactForm.lastname}
                    onChange={(e: any) => setContactForm((prev) => ({ ...prev, lastname: e.target.value }))}
                    placeholder="Enter last name"
                    disabled={submitting}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      border: `1px solid ${borderColor}`,
                      background: theme === "dark" ? "rgba(255,255,255,0.05)" : "white",
                      color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                    }}
                  />
                </div>
              </div>

              <div>
                <Label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Email Address *
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="email"
                    value={contactForm.email}
                    onChange={(e: any) => {
                      setEmail(e.target.value)
                      setContactForm((prev) => ({ ...prev, email: e.target.value }))
                    }}
                    placeholder="Enter email address"
                    disabled={submitting}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      paddingRight: searching ? "2.5rem" : "0.75rem",
                      borderRadius: "0.5rem",
                      border: `1px solid ${borderColor}`,
                      background: theme === "dark" ? "rgba(255,255,255,0.05)" : "white",
                      color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                    }}
                  />
                  {searching && (
                    <Spinner
                      size="tiny"
                      style={{
                        position: "absolute",
                        right: "0.75rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </div>
                {users.length > 0 && (
                  <div style={{
                    marginTop: "0.5rem",
                    padding: "0.5rem",
                    background: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                    borderRadius: "0.5rem",
                    border: `1px solid ${borderColor}`,
                  }}>
                    <p style={{
                      fontSize: "0.875rem",
                      color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                      margin: "0 0 0.5rem 0",
                    }}>
                      Existing candidates with this email:
                    </p>
                    {users.map((e, i) => (
                      <div key={i} style={{ marginBottom: "0.25rem" }}>
                        <Link
                          to={`/admin/user/${e.id}`}
                          style={{
                            color: tokens.colorBrandForeground1,
                            textDecoration: "none",
                            fontSize: "0.875rem",
                          }}
                        >
                          {e.fields.first_name} {e.fields.last_name} ({e.fields.email})
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <Label
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                      marginBottom: "0.5rem",
                      display: "block",
                    }}
                  >
                    Phone Number
                  </Label>
                  <Input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e: any) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                    disabled={submitting}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      border: `1px solid ${borderColor}`,
                      background: theme === "dark" ? "rgba(255,255,255,0.05 scientifically proven to be awesome)" : "white",
                      color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                    }}
                  />
                </div>
                <div>
                  <Label
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                      marginBottom: "0.5rem",
                      display: "block",
                    }}
                  >
                    City
                  </Label>
                  <Input
                    value={contactForm.city}
                    onChange={(e: any) => setContactForm((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="Enter city"
                    disabled={submitting}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      border: `1px solid ${borderColor}`,
                      background: theme === "dark" ? "rgba(255,255,255,0.05)" : "white",
                      color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                    }}
                  />
                </div>
              </div>

              <div>
                <Label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Job Title *
                </Label>
                <select
                  value={contactForm.jobtitle}
                  onChange={(e) => {
                    const value = e.target.value
                    setContactForm((prev) => ({
                      ...prev,
                      jobtitle: value,
                      campaign: value,
                    }))
                  }}
                  disabled={submitting || loadingTitles || loadingSkills}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: `1px solid ${borderColor}`,
                    background: theme === "dark" ? "rgba(255,255,255,0.05)" : "white",
                    color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                    fontSize: "0.875rem",
                  }}
                >
                  <option value="">
                    {loadingTitles ? "Loading job titles..." : "Select a job title"}
                  </option>
                  {jobTitles.map((title, index) => (
                    <option key={index} value={title}>{title}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Communication Skills
                </Label>
                <select
                  value={contactForm.Communication_Skills ?? ""}
                  onChange={(e) => {
                    const value = e.target.value
                    setContactForm((prev) => ({
                      ...prev,
                      Communication_Skills: value,
                    }))
                  }}
                  disabled={submitting || loadingTitles || loadingSkills}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: `1px solid ${borderColor}`,
                    background: theme === "dark" ? isOpen ? "rgba(255,255,255,0.05)" : "white" : "white",
                    color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                    fontSize: "0.875rem",
                  }}
                >
                  <option value="">
                    {loadingSkills ? "Loading communication skills..." : "Select a communication skill"}
                  </option>
                  {skills.map((title, index) => (
                    <option key={index} value={title}>{title}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <Label
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                      marginBottom: "0.5rem",
                      display: "block",
                    }}
                  >
                    Current Salary
                  </Label>
                  <Input
                    value={contactForm.currentsalary}
                    onChange={(e: any) => setContactForm((prev) => ({ ...prev, currentsalary: e.target.value }))}
                    placeholder="Enter current salary"
                    disabled={submitting}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      border: `1px solid ${borderColor}`,
                      background: theme === "dark" ? "rgba(255,255,255,0.05)" : "white",
                      color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                    }}
                  />
                </div>
                <div>
                  <Label
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                      marginBottom: "0.5rem",
                      display: "block",
                    }}
                  >
                    Expected Salary
                  </Label>
                  <Input
                    value={contactForm.expectedsalary}
                    onChange={(e: any) => setContactForm((prev) => ({ ...prev, expectedsalary: e.target.value }))}
                    placeholder="Enter expected salary"
                    disabled={submitting}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      border: `1px solid ${borderColor}`,
                      background: theme === "dark" ? "rgba(255,255,255,0.05)" : "white",
                      color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                    }}
                  />
                </div>
              </div>

              <div>
                <Label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Years of Experience
                </Label>
                <Input
                  value={contactForm.yearsofexperience.toString()}
                  onChange={(e: any) =>
                    setContactForm((prev) => ({ ...prev, yearsofexperience: (e.target.value) || '' }))
                  }
                  placeholder="Enter years of experience"
                  min="0"
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: `1px solid ${borderColor}`,
                    background: theme === "dark" ? "rgba(255,255,255,0.05)" : "white",
                    color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                  }}
                />
              </div>
              <div>
                <Label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Upload CV *
                </Label>
                <div
                  style={{
                    border: `2px dashed ${borderColor}`,
                    borderRadius: "0.5rem",
                    padding: "1.5rem",
                    textAlign: "center",
                    background: theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                    cursor: submitting ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    opacity: submitting ? 0.6 : 1,
                  }}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    disabled={submitting}
                    style={{ display: "none" }}
                    id="cv-upload"
                  />
                  <label
                    htmlFor="cv-upload"
                    style={{
                      cursor: submitting ? "not-allowed" : "pointer",
                      display: "block",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                      <div
                        style={{
                          background: tokens.colorBrandBackground,
                          borderRadius: "50%",
                          padding: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Upload style={{ width: 20, height: 20, color: "white" }} />
                      </div>
                      {contactForm.cv ? (
                        <div>
                          <p
                            style={{
                              fontSize: "0.875rem",
                              fontWeight: 600,
                              color: "#10b981",
                              margin: 0,
                            }}
                          >
                            {contactForm.cv.name}
                          </p>
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: theme === "dark" ? "#9ca3af" : "#6b7280",
                              margin: "0.25rem 0 0 0",
                            }}
                          >
                            {submitting ? "Uploading..." : "Click to change file"}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p
                            style={{
                              fontSize: "0.875rem",
                              fontWeight: 600,
                              color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                              margin: 0,
                            }}
                          >
                            Click to upload CV
                          </p>
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: theme === "dark" ? "#9ca3af" : "#6b7280",
                              margin: "0.25rem 0 0 0",
                            }}
                          >
                            PDF, DOC, DOCX (max 10MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </DialogContent>

          <DialogActions
            style={{
              padding: "1.5rem",
              borderTop: `1px solid ${borderColor}`,
              flexShrink: 0,
              background: theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", width: "100%" }}>
              <Button
                appearance="subtle"
                onClick={handleClose}
                disabled={submitting}
                style={{
                  flex: 1,
                  color: "#6b7280",
                  border: `1px solid ${borderColor}`,
                  background: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                }}
              >
                Cancel
              </Button>
              <Button
                appearance="primary"
                onClick={handleSubmit}
                disabled={
                  submitting ||
                  !contactForm.firstname ||
                  !contactForm.lastname ||
                  !contactForm.email ||
                  !contactForm.jobtitle ||
                  !contactForm.cv
                }
                style={{
                  flex: 2,
                  background: submitting ? tokens.colorBrandBackground : tokens.colorBrandBackground,
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  fontWeight: 600,
                }}
              >
                {submitting ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Spinner size="tiny" />
                    Adding Candidate...
                  </div>
                ) : (
                  "Add Candidate"
                )}
              </Button>
            </div>
          </DialogActions>
        </DialogSurface>
      </Dialog>
      <Toaster toasterId={toasterId} />
    </>
  )
}

export default CreateContactModal