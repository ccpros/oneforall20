import { defineField, defineType } from "sanity";

// schemas/complaint.ts
export const complaintType = defineType({
    name: "complaint",
    title: "Complaint",
    type: "document",
    fields: [
        defineField({
        name: "userId",
        title: "Clerk User ID",
        type: "string",
      }),
      defineField({
        name: "firstName",
        title: "First Name",
        type: "string",
      }),
      defineField({
        name: "lastName",
        title: "Last Name",
        type: "string",
      }),
      defineField({
        name: "email",
        title: "Email",
        type: "string",
      }),
      defineField({
        name: "phone",
        title: "Phone",
        type: "string",
      }),
      defineField({
        name: "claimants",
        title: "Claimants",
        type: "array",
        of: [{ type: "string" }],
      }),
      defineField({
        name: "defendants",
        title: "Potential Defendants",
        type: "array",
        of: [{ type: "string" }],
      }),
      defineField({
        name: "witnesses",
        title: "Witnesses",
        type: "array",
        of: [{ type: "string" }],
      }),
      defineField({
        name: "caseNumbers",
        title: "Case Numbers",
        type: "array",
        of: [{ type: "string" }],
      }),
      defineField({
        name: "legalViolations",
        title: "Legal Violations",
        type: "array",
        of: [{ type: "string" }],
      }),
      defineField({
        name: "subject",
        title: "Subject",
        type: "string",
      }),
      defineField({
        name: "description",
        title: "Description",
        type: "text",
      }),
      defineField({
        name: "fileUrl",
        title: "Uploaded File URL",
        type: "url",
      }),
      defineField({
        name: "consentGiven",
        title: "Consent Given",
        type: "boolean",
      }),
      defineField({
        name: "submittedAt",
        title: "Submitted At",
        type: "datetime",
      }),
    ],
  });
  