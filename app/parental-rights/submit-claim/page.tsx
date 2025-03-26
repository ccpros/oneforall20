"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function SubmitComplaintPage() {
  const { user } = useUser();
  const [step, setStep] = useState(1);

  type FormDataType = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    claimants: string[];
    defendants: string[];
    witnesses: string[];
    caseNumbers: string[];
    legalViolations: string[];
    subject: string;
    description: string;
    file: File | null;
    consent: boolean;
  };

  const [formData, setFormData] = useState<FormDataType>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.emailAddresses?.[0]?.emailAddress || "",
    phone: "",
    claimants: [""],
    defendants: [""],
    witnesses: [""],
    caseNumbers: [""],
    legalViolations: [],
    subject: "",
    description: "",
    file: null,
    consent: false,
  });

  const legalOptions: string[] = [
    "Discrimination based on protected status",
    "Violation of due process rights",
    "Infringement on parental rights",
    "Denial of the right to counsel",
    "Denial of fair hearing",
    "Failure to accommodate disabilities",
    "Judicial bias or misconduct",
    "Lawyer misconduct or dishonesty",
    "Other"
  ];

  const handleChange = <K extends keyof FormDataType>(field: K, value: FormDataType[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDynamicListChange = (
    field: keyof Pick<FormDataType, "claimants" | "defendants" | "witnesses" | "caseNumbers">,
    index: number,
    value: string
  ) => {
    const updatedList = [...formData[field]];
    updatedList[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updatedList }));
  };

  const addToList = (field: keyof Pick<FormDataType, "claimants" | "defendants" | "witnesses" | "caseNumbers">) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleViolationToggle = (option: string) => {
    setFormData((prev) => {
      const exists = prev.legalViolations.includes(option);
      return {
        ...prev,
        legalViolations: exists
          ? prev.legalViolations.filter((item) => item !== option)
          : [...prev.legalViolations, option],
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleChange("file", e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    console.log("🚨 handleSubmit started");
  
    try {
      // Add logs at each critical step
  
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast.error("Missing required fields");
        console.log("❌ Missing required fields");
        return;
      }
  
      let fileUrl = "";
  
      if (formData.file) {
        console.log("📤 Uploading file...");
  
        const uploadForm = new FormData();
        uploadForm.append("file", formData.file);
  
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm,
        });
  
        const uploadResult = await uploadRes.json();
        console.log("📦 Upload response:", uploadResult);
  
        if (!uploadResult.success) {
          toast.error("Upload failed");
          return;
        }
  
        fileUrl = uploadResult.url;
      }
  
      console.log("🧾 Sending complaint to Sanity...");
  
      const complaint = {
        _type: "complaint",
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        description: formData.description,
        fileUrl,
        consentGiven: formData.consent,
        submittedAt: new Date().toISOString(),
      };
  
      const sanityRes = await fetch("/api/submit-to-sanity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(complaint),
      });
  
      const sanityResult = await sanityRes.json();
      console.log("🧾 Sanity result:", sanityResult);
  
      if (sanityRes.ok) {
        toast.success("Complaint submitted");
      } else {
        toast.error("Sanity submission failed");
      }
    } catch (err) {
      console.error("💥 handleSubmit crashed:", err);
      toast.error("Something went wrong.");
    }
  };
  

  return (
    <div className="min-h-screen mt-16 bg-gray-100 dark:bg-gray-900 px-4 py-5 text-gray-900 dark:text-gray-100">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow dark:shadow-gray-600 dark:shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          File a Parental Rights Complaint
        </h1>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 w-8 rounded-full ${s <= step ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-1">
            <div className="flex space-x-2 justify-between">
            <Label className="flex min-w-16 md:min-w-20 items-center text-xs md:text-sm">First Name</Label>
            <Input className="h-7 items-center text-xs md:text-sm dark:border-gray-600" value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} required />
            
            <Label className="flex min-w-16 md:min-w-20 items-center text-xs md:text-sm">Last Name</Label>
            <Input className="h-7 items-center text-xs md:text-sm dark:border-gray-600 " value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} required />
            </div>
            <div className="flex space-x-2 justify-between pt-4">
            <Label className="flex items-center text-xs md:text-sm">Email</Label>
            <Input 
                className="h-7 items-center text-xs md:text-sm dark:border-gray-600 dark:muted"
              value={formData.email || user?.emailAddresses?.[0]?.emailAddress || ""} 
              onChange={(e) => handleChange("email", e.target.value)} 
              required
              disabled
              placeholder="Enter your email"
            />
            </div>
            <div className="flex space-x-2 justify-between pt-4">
            <Label className="flex min-w-24 items-center text-xs md:text-sm">Phone Number</Label>
            <Input className="h-7 items-center text-xs md:text-sm dark:border-gray-600" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
            </div>
            <Button onClick={() => {
              if (!formData.firstName || !formData.lastName || !(formData.email || user?.emailAddresses?.[0]?.emailAddress)) {
                toast.error("Please complete all required fields before continuing.");
              } else {
                setStep(2);
              }
            }}>Next</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
            <Label className="text-xs md:text-sm">Claimants</Label>
            {formData.claimants.map((claimant, i) => (
              <Input className="h-6 md:h-8 text-xs md:text-sm dark:border-gray-600" key={i} value={claimant} onChange={(e) => handleDynamicListChange("claimants", i, e.target.value)} />
            ))}
            <Button className="text-xs md:text-sm h-6 md:h-8 mt-2" variant="outline" onClick={() => addToList("claimants")}>+ Add Claimant</Button>
            </div>

            <div>
            <Label className="text-xs md:text-sm">Potential Defendants</Label>
            {formData.defendants.map((defendant, i) => (
              <Input className="text-xs md:text-sm h-6 md:h-8 dark:border-gray-600" key={i} value={defendant} onChange={(e) => handleDynamicListChange("defendants", i, e.target.value)} />
            ))}
            <Button className="text-xs md:text-sm h-6 md:h-8 mt-2" variant="outline" onClick={() => addToList("defendants")}>+ Add Defendant</Button>
            </div>

            <div>
            <Label className="text-xs md:text-sm">Witnesses</Label>
            {formData.witnesses.map((witness, i) => (
              <Input className="text-xs md:text-sm h-6 md:h-8 dark:border-gray-600" key={i} value={witness} onChange={(e) => handleDynamicListChange("witnesses", i, e.target.value)} />
            ))}
            <Button className="text-xs md:text-sm h-6 md:h-8 mt-2" variant="outline" onClick={() => addToList("witnesses")}>+ Add Witness</Button>
            </div>

            <div>
            <Label className="text-xs md:text-sm">Case Numbers</Label>
            {formData.caseNumbers.map((cn, i) => (
              <Input className="text-xs md:text-sm h-6 md:h-8 dark:border-gray-600" key={i} value={cn} onChange={(e) => handleDynamicListChange("caseNumbers", i, e.target.value)} />
            ))}
            <Button className="text-xs md:text-sm h-6 md:h-8 mt-2" variant="outline" onClick={() => addToList("caseNumbers")}>+ Add Case Number</Button>
            </div>

        
            <Label className="block mt-4 text-sm">Legal Violations</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {legalOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={formData.legalViolations.includes(option)}
                    onCheckedChange={() => handleViolationToggle(option)}
                  />
                  <Label className="text-xs md:text-sm" htmlFor={option}>{option}</Label>
                </div>
              ))}
            </div>
              
            

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Next</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Label>Subject</Label>
            <Input className="dark:border-gray-600" value={formData.subject} onChange={(e) => handleChange("subject", e.target.value)} required />
            <Label>Description</Label>
            <Textarea 
            placeholder="In summary terms please describe the nature of your complaint, including any relevant details and dates. This is the summary of your complaint that will be submitted to our intake specialists. Example: I am a parent in a custody dispute and I believe my rights have been violated. I have been refused the right to see my child and I have not been given a fair hearing in court. I have evidence of bias from the judge and misconduct from my lawyer. I am seeking help to address these issues. !!We Do Not Expect You To Have Evidence At This Stage!!"

            className="dark:border-gray-600 min-h-40 text-xs" value={formData.description} onChange={(e) => handleChange("description", e.target.value)} required />
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={() => {
                if (!formData.subject || !formData.description) {
                  toast.error("Please complete all required fields before continuing.");
                } else {
                  setStep(4);
                }
              }}>Next</Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <Label>Upload Supporting Files</Label>
            <Input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.png,.jpg" />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="consent"
                checked={formData.consent}
                onCheckedChange={(checked) => handleChange("consent", !!checked)}
              />
              <Label htmlFor="consent" className="text-xs">
                I consent to the information in this form being stored and used for legal purposes. I understand that I will not be provided legal advice through this process, and that no communications related to this form will be considered legal advice. I also acknowledge that submitting this form does not create an attorney-client relationship. I understand that I may be contacted by a legal professional for further assistance.
              </Label>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              <Button onClick={handleSubmit}>Submit</Button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
