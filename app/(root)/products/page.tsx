import Sort from "@/components/Sort";
import Filters from "@/components/Filters";
import { parseFilterParams } from "@/lib/utils/query";

type SearchParams = Record<string, string | string[] | undefined>;

const page = async ({searchParams}: {
  searchParams: Promise<SearchParams>;
}) => {
    const sp = await searchParams;
    const parsed = parseFilterParams(sp);

    console.log('Search Params:', sp);
    console.log('Parsed Search Params:', parsed);

    const activeBadges: string[] = [];

    (sp.gender ? (Array.isArray(sp.gender) ? sp.gender : [sp.gender]) : []).forEach((g) =>
        activeBadges.push(String(g)[0].toUpperCase() + String(g).slice(1))
    );
    (sp.size ? (Array.isArray(sp.size) ? sp.size : [sp.size]) : []).forEach((s) => activeBadges.push(`Size: ${s}`));
    (sp.color ? (Array.isArray(sp.color) ? sp.color : [sp.color]) : []).forEach((c) =>
        activeBadges.push(String(c)[0].toUpperCase() + String(c).slice(1))
    );
    (sp.price ? (Array.isArray(sp.price) ? sp.price : [sp.price]) : []).forEach((p) => {
        const [min, max] = String(p).split("-");
        const label = min && max ? `$${min} - $${max}` : min && !max ? `Over $${min}` : `$0 - $${max}`;
        activeBadges.push(label);
    });
  return (
    <div className='mx-auto container pt-20 lg:pt-30 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen'>
         <header className="flex items-center justify-between py-6">
        <h1 className="text-heading-3 text-dark-900">New</h1>
        <Sort />
      </header>

      {activeBadges.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {activeBadges.map((b, i) => (
            <span
              key={`${b}-${i}`}
              className="rounded-full border border-light-300 px-3 py-1 text-caption text-dark-900"
            >
              {b}
            </span>
          ))}
        </div>
      )}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr] ">
        <Filters />
        <h1>d</h1>
      </section>
    </div>
  )
}

export default page