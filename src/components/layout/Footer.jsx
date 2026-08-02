import Image from "next/image";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaRedditAlien,
  FaYoutube,
} from "react-icons/fa";

const PRIMARY_COLOR = "#007fad";

const footerLinks = {
  PRODUCTS: [
    "Sit-Stand Solutions",
    "VariDesk Converters",
    "Desks and Tables",
    "Seating",
    "Storage",
    "Partitions and Privacy",
    "Accessories",
    "Shop by Space",
    "Deals",
    "View All Products",
  ],
  ABOUT: [
    "Our Company",
    "The Vari Difference",
    "Corporate Programs",
    "Industries",
    "Showroom Tours",
    "Careers",
  ],
  SUPPORT: [
    "Shipping Policy",
    "Warranty",
    "Returns",
    "Recall Notices",
    "My Account",
    "FAQs",
    "Contact Us",
  ],
  RESOURCES: [
    "Resource Center",
    "Buyer's Guide",
    "Reviews",
    "Space Planning",
    "VariSpace",
    "Vari Business Login",
    "View My List",
    "Desk Designer",
  ],
};

const socialIcons = [
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaRedditAlien,
  FaYoutube,
];

export default function Footer() {
  return (
    <footer className="bg-white pb-12 pt-8 md:pt-14">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-1">
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:grid-cols-[0.9fr_1fr_1fr_1fr_1fr_2fr]">
          {/* Mobile Logo */}
          <div className="col-span-2 sm:hidden">
            <Link href="/">
              <Image
                src="/images/logo.svg"
                alt="Vari Logo"
                width={120}
                height={51}
                className="h-auto w-[120px]"
              />
            </Link>
          </div>

          {/* Desktop Logo */}
          <div className="hidden sm:block">
            <Link href="/">
              <Image
                src="/images/logo.svg"
                alt="Vari Logo"
                width={90}
                height={38}
                className="h-auto w-[90px]"
              />
            </Link>
          </div>

          {/* Desktop Logo */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3
                className="mb-4 text-[13px] font-bold tracking-wider"
                style={{ color: PRIMARY_COLOR }}
              >
                {title}
              </h3>

              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-[15px] text-[#4d4d4d] transition-colors hover:text-[#007fad] hover:underline"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Help Section */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <HelpCircle size={22} style={{ color: PRIMARY_COLOR }} />
              <h3 className="text-lg font-bold" style={{ color: PRIMARY_COLOR }}>
                NEED HELP?
              </h3>
            </div>

            <p className="text-[#333]">
              Call{" "}
              <Link
                href="#"
                className="font-semibold hover:underline"
                style={{ color: PRIMARY_COLOR }}
              >
                +1 (800) 207-2587
              </Link>{" "}
              or{" "}
              <Link
                href="#"
                className="font-semibold hover:underline"
                style={{ color: PRIMARY_COLOR }}
              >
                CONTACT US
              </Link>
            </p>

            <div>
              <h3
                className="mb-3 text-[13px] font-bold tracking-wider"
                style={{ color: PRIMARY_COLOR }}
              >
                CONNECT WITH US
              </h3>

              <div className="flex flex-wrap gap-2">
                {socialIcons.map((Icon, index) => (
                  <Link
                    key={index}
                    href="#"
                    className="flex h-[45px] w-[45px] items-center justify-center rounded-full border text-[#007fad] transition-colors hover:bg-[#007fad] hover:text-white"
                    style={{ borderColor: PRIMARY_COLOR }}
                  >
                    <Icon size={18} />
                  </Link>
                ))}
              </div>
            </div>

            <Image
              src="/images/bbb.png"
              alt="BBB Logo"
              width={200}
              height={80}
              className="h-auto w-[200px] max-w-full object-contain"
            />
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-10 text-center text-sm text-[#333]">
          ©2025-2020 Varidesk, LLC dba Vari®. All rights reserved.
        </div>
      </div>
    </footer>
  );
}