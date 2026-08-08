import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { client } from "../../sanity/lib/client";
import { NAV_CATEGORIES_QUERY } from "../../sanity/lib/queries";

export default async function SiteLayout({ children }) {
  const categories = await client
    .fetch(NAV_CATEGORIES_QUERY, {}, { next: { revalidate: 30 } })
    .catch(() => []);

  return (
    <>
      <Navbar categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}