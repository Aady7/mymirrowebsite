'use client'
import { Suspense } from "react";
import StylistSays from "@/app/components/recommendations/stylistSays"
import PageLoader from "@/app/components/common/PageLoader";

const Recommendations = () => {
  return (
    <Suspense fallback={<PageLoader loadingText="Loading recommendations..." />}>
      <StylistSays/>
    </Suspense>
  )
}

export default Recommendations