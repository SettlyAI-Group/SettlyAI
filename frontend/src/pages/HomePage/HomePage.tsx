import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import TestimonialsSection from "./components/TestimonialsSection";
import type { ITestimonial } from "@/interfaces/Testimonial";
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();

  type Suburb = {
    suburbName: string;
    state: string;
    suburbId: number;
  };

  //todo: change to fetch suburb id by suburb name and state
  //check database to match for testing
  const melbourne = { suburbName: 'Melbourn', state: 'VIC', suburbId: 1 };
  const sydney = { suburbName: 'Sydney', state: 'NSW', suburbId: 2 };

  const checkSuburb = (suburb: Suburb) => {
    const { suburbId } = suburb;

    localStorage.setItem('suburbId', suburbId.toString());

    navigate(`/suburb/1`);
  };

  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);

  useEffect(() => {
    axios.get("/api/testimonials").then((res) => {
      setTestimonials(res.data);
    });
  }, []);

  return (
    <>
      <h1>Home</h1>
      <button onClick={() => checkSuburb(sydney)}>Go to Sydney</button>
      <button onClick={() => checkSuburb(melbourne)}>Go to Melbourne</button>
      <TestimonialsSection testimonials={testimonials} />
    </>
  );
};

export default HomePage;
