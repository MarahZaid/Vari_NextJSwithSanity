import HeroHome from "../../components/home/HeroHome";
import CategoriesSection from "../../components/home/CategoriesSection";
import ContactEmail from "../../components/home/ContactEmail";

export const metadata = {
  title: "Height-Adjustable Standing Desks & Office Furniture",
  description:
    "Shop height-adjustable standing desks, converters, and office furniture built for comfort and productivity. Fast shipping, secure checkout.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Vari | Height-Adjustable Standing Desks & Office Furniture",
    description:
      "Shop height-adjustable standing desks, converters, and office furniture built for comfort and productivity.",
    url: "/",
    siteName: "Vari",
    type: "website",
    images: [
      {
        url: "/images/hero-home.jpg", // ⬅️ حط صورة 1200x630 فعلية جوا /public
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vari | Height-Adjustable Standing Desks & Office Furniture",
    description:
      "Shop height-adjustable standing desks, converters, and office furniture built for comfort and productivity.",
    images: ["/hero-home.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Vari",
  url: "https://vari-next-j-swith-sanity.vercel.app", // 
  logo: "https://vari-next-j-swith-sanity.vercel.app/logo.svg", 
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroHome />
      <CategoriesSection />
      <ContactEmail />
    </>
  );
}