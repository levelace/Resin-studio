import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About the studio — our story, process, and the why behind every piece.",
};

export default function AboutPage() {
  return (
    <div className="container-prose py-16">
      <h1 className="text-4xl font-bold md:text-5xl">About the studio</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        We&apos;re a small Kumasi-based studio making resin art, souvenirs, thoughtful packaging, and custom-printed gifts by hand.
      </p>
      <div className="prose prose-lg mt-8 max-w-none leading-relaxed text-foreground/90">
        <p>
          Every piece we pour, fold, or print starts with a simple idea: the object you give or receive should feel
          considered. That&apos;s why we make our own moulds, fold our own gift boxes, and batch our candles in small
          runs — so nothing feels mass-produced, even when you order ten of something.
        </p>
        <h2 className="mt-8 text-2xl font-bold">What we make</h2>
        <ul>
          <li>Resin art — coasters, trays, jewellery, wall pieces.</li>
          <li>Paper gift boxes and bags for launches, weddings, and corporate hampers.</li>
          <li>Custom T-shirt printing via DTF on premium cotton.</li>
          <li>Personalised ceramic mugs, dishwasher- and microwave-safe.</li>
          <li>Soy-wax scented candles in small, poured-to-order batches.</li>
        </ul>
        <h2 className="mt-8 text-2xl font-bold">Teaching what we know</h2>
        <p>
          We also run a small online school for people curious about resin and candle making. Our courses are
          written for the Ghanaian context — materials you can actually source locally, power-cut-friendly drying
          schedules, and mobile-data-friendly video.
        </p>
      </div>
    </div>
  );
}
