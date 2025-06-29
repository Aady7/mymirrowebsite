import HomeHeroSection from "@/app/components/home/HomeHeroSection";
import HomeFeatureSection from "@/app/components/home/HomeFeatureSection";
import HomeQuizCTA from "@/app/components/home/HomeQuizCTA";
import HomeStylistSection from "@/app/components/home/HomeStylistSection";
import HomeTestimonials from "@/app/components/home/HomeTestimonials";
import Script from 'next/script';

const page = async () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MyMirro",
    "alternateName": ["Mirro", "My Mirro"],
    "url": "https://mymirro.com",
    "description": "AI-powered personal fashion stylist providing personalized clothing recommendations, style quizzes, and curated outfits tailored to your personality and preferences.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://mymirro.com/?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MyMirro",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mymirro.com/assets/logo.png"
      },
      "description": "Revolutionary AI-powered personal fashion stylist platform",
      "foundingDate": "2024",
      "industry": "Fashion Technology",
      "serviceArea": {
        "@type": "Country",
        "name": "India"
      },
      "services": [
        "Personal Fashion Styling",
        "AI-Powered Style Recommendations", 
        "Outfit Curation",
        "Style Personality Analysis",
        "Fashion Consulting"
      ]
    },
    "mainEntity": {
      "@type": "Service",
      "name": "AI-Powered Personal Fashion Styling",
      "description": "Get personalized fashion recommendations and style advice powered by artificial intelligence",
      "provider": {
        "@type": "Organization",
        "name": "MyMirro"
      },
      "serviceType": "Fashion Consulting",
      "areaServed": "India",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Fashion Styling Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Style Quiz",
              "description": "Discover your fashion personality with our comprehensive style assessment"
            }
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Service",
              "name": "AI Recommendations",
              "description": "Get personalized clothing and outfit recommendations powered by AI"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "Curated Outfits",
              "description": "Browse professionally curated outfit combinations for every occasion"
            }
          }
        ]
      }
    }
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <div>
        <HomeHeroSection />
        <HomeFeatureSection />
        <HomeQuizCTA />
        <div className="mb-10">
          <HomeStylistSection />
        </div>
        <HomeTestimonials />
      </div>
    </>
  );
};

export default page;
