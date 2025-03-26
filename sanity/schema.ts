import { SchemaTypeDefinition } from "sanity";
import {
  courseType,
  moduleType,
  lessonType,
  instructorType,
  studentType,
  enrollmentType,
  categoryType,
  lessonCompletionType,
  complaintType,
} from "./schemaTypes";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    courseType,
    moduleType,
    lessonType,
    instructorType,
    studentType,
    enrollmentType,
    categoryType,
    lessonCompletionType,
    complaintType,
  ],
};
