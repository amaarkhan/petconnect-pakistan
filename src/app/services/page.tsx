import { services } from "@/data/services";
import SectionHeader from "@/components/SectionHeader";

export default function ServicesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <SectionHeader title="Services directory" subtitle="Care" />
      <p className="mt-4 text-sm text-zinc-600">
        Reach out to trusted vets, groomers, and pet shops in your city.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">
              {service.type}
            </p>
            <h3 className="mt-3 text-lg font-semibold text-zinc-900">{service.name}</h3>
            <p className="mt-2 text-sm text-zinc-500">{service.location}</p>
            <p className="mt-4 text-sm font-semibold text-zinc-800">{service.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
