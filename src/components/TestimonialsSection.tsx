import { Reveal } from "@/components/landing/Reveal";
import { testimonials } from "@/lib/landing";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-white py-20 sm:py-28">
      <div className="container-custom">
        <Reveal>
        <h2 className="t-stagger-line t-stagger-line--1 max-w-2xl font-display text-[28px] font-extrabold leading-tight text-ink sm:text-[40px]">
          From people who learned here
        </h2>
        <div className="t-stagger-line t-stagger-line--2 mt-10 grid gap-5 md:grid-cols-2">
          {testimonials.map((item) => (
            <figure key={item.name} className="rounded-[28px] border border-line bg-paper p-7">
              <div className="flex gap-1 text-sun" aria-label="5 stars">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-lg font-medium leading-8 text-ink">“{item.content}”</blockquote>
              <figcaption className="mt-6">
                <span className="block font-bold text-ink">{item.name}</span>
                <span className="text-sm font-medium text-copy">{item.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        </Reveal>
      </div>
    </section>
  );
}
