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

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.emailAddresses?.[0]?.emailAddress || "",
    phone: "",
    subject: "",
    description: "",
    file: null as File | null,
    consent: false,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleChange("file", e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!formData.consent) {
      toast.error("You must consent before submitting.");
      return;
    }

    try {
      // TODO: Upload file to Azure
      // TODO: Save complaint to Sanity

      toast.success("Complaint submitted successfully.");
      setStep(1); // reset form or redirect
    } catch (err) {
      toast.error("Submission failed.");
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 mt-20">
      <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">
          File a Parental Rights Complaint
        </h1>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-8 rounded-full ${
                s <= step ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                className="border-gray-300"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
              className="border-gray-300"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>
            <div>
              <Label>Email (read-only)</Label>
              <Input 
              className="border-gray-300"
              value={formData.email} disabled />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number (optional)</Label>
              <Input
              className="border-gray-300"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
            <Button className="mt-4" onClick={() => setStep(2)}>
              Next
            </Button>
          </div>
        )}

        {/* Step 2: Complaint Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
              className="border-gray-300"
                id="subject"
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                className="border-gray-300"
                rows={6}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)}>Next</Button>
            </div>
          </div>
        )}

        {/* Step 3: File Upload & Consent */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Upload Supporting Files</Label>
              <Input
              className="border-gray-300 hover:text-blue-600"
                id="file"
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
              className="border-gray-300"
                id="consent"
                checked={formData.consent}
                onCheckedChange={(checked) =>
                  handleChange("consent", !!checked)
                }
              />
              <Label htmlFor="consent" className="text-sm">
                I consent to this information being stored and used for legal purposes.
              </Label>
            </div>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
