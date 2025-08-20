"use client";
import { useParams } from "next/navigation";

const LookbookPage = () => {
    
  const { id } = useParams();
  return <div>LookbookPage {id}</div>;
};

export default LookbookPage;