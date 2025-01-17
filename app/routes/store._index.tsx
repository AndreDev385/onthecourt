import Hero from "~/components/store/landing/hero";

export async function loader() {
  return null;
}

export default function LandingPage() {
  return (
    <div>
      <section className="aspect-video w-full" id="hero">
        <Hero />
      </section>
      <section id="promotions">Promotions Section</section>
      <section id="popular">Popular Section</section>
    </div>
  );
}
