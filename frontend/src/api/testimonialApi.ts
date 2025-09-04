import type { ITestimonial } from "@/interfaces/Testimonial";
import httpClient from "./httpClient";

// Get all testimonials
export const getTestimonials = async (): Promise<ITestimonial[]> => {
  const response = await httpClient.get<ITestimonial[]>("/testimonials");
  return response.data;
};
