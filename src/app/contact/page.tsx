import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for custom orders, wholesale, or course questions.",
};

export default function ContactPage() {
  return (
    <div className="container py-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h1 className="text-4xl font-bold md:text-5xl">Say hello</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Custom order, bulk hamper, press, or wholesale enquiry? We usually reply within a working day.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary" /> hello@resinstudio.gh</li>
            <li className="flex items-center gap-3"><Phone className="h-5 w-5 text-primary" /> +233 20 000 0000 (WhatsApp)</li>
            <li className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" /> Accra, Ghana</li>
          </ul>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
