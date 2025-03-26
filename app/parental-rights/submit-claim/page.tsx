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
    "Lawyer misconduct or dishonesty"
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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.description) {
      toast.error("Please fill out all required fields.");
      return;
    }
    if (!formData.consent) {
      toast.error("You must consent before submitting.");
      return;
    }
    toast.success("Complaint submitted successfully.");
  };

  return (
    <div className="min-h-screen mt-16 bg-gray-100 dark:bg-gray-900 px-4 py-10 text-gray-900 dark:text-gray-100">
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
            <Label className="flex min-w-16 items-center text-xs md:stext-sm">First Name</Label>
            <Input className="h-7 items-center text-xs md:text-sm border-gray-600" value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} required />
            
            <Label className="flex min-w-16 items-center text-xs md:text-sm">Last Name</Label>
            <Input className="h-7 items-center text-xs md:text-sm border-gray-600 " value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} required />
            </div>
            <div className="flex space-x-2 justify-between pt-4">
            <Label className="flex items-center text-xs md:text-sm">Email</Label>
            <Input 
                className="h-7 items-center text-xs md:text-sm"
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
            <div className="text-xs">
            <Label className="text-xs md:text-sm">Claimants</Label>
            {formData.claimants.map((claimant, i) => (
              <Input className="h-6 md:h-8 text-xs md:text-sm dark:border-gray-600" key={i} value={claimant} onChange={(e) => handleDynamicListChange("claimants", i, e.target.value)} />
            ))}
            <Button className="text-xs md:text-sm h-6 md:h-8 mt-2" variant="outline" onClick={() => addToList("claimants")}>+ Add Claimant</Button>
            </div>

            <div className="text-xs">
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
            <Textarea className="dark:border-gray-600 min-h-40" value={formData.description} onChange={(e) => handleChange("description", e.target.value)} required />
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
              <Label htmlFor="consent" className="text-sm">
                I consent to this information being stored and used for legal purposes.
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
