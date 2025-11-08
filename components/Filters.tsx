"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getArrayParam, removeParams, toggleArrayParam } from "@/lib/utils/query";
import FilterGroup from "./FilterGroup";

const GENDERS = ["men", "women"] as const;
const SIZES = ["XS", "S", "M", "L", "XL"] as const;
const COLORS = ["black", "white", "red", "green", "blue", "grey"] as const;
const PRICES = [
  { id: "0-50", label: "$0 - $50" },
  { id: "50-100", label: "$50 - $100" },
  { id: "100-150", label: "$100 - $150" },
  { id: "150-", label: "Over $150" },
] as const;

type GroupKey = "gender" | "size" | "color" | "price";

const Filters = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const search = useMemo(() => `?${searchParams.toString()}`, [searchParams]);

    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState<Record<GroupKey, boolean>>({
        gender: true,
        size: true,
        color: true,
        price: true,
    });

    const activeCounts = {
        gender: getArrayParam(search, "gender").length,
        size: getArrayParam(search, "size").length,
        color: getArrayParam(search, "color").length,
        price: getArrayParam(search, "price").length,
    };

    useEffect(() => {
        setOpen(false);
    }, [search]);

    const clearAll = () => {
      const url = removeParams(pathname, search, ["gender", "size", "color", "price", "page"]);
      router.push(url, { scroll: false });
    }

    const onToggle = (key: GroupKey, value: string) => {
    const url = toggleArrayParam(pathname, search, key, value);
    router.push(url, { scroll: false });
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between md:hidden">
        <button
            className="rounded-md border border-light-300 px-3 py-2 text-body-medium"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
          >
            Filters
          </button>
          <button className="text-caption text-dark-700 underline" onClick={clearAll}>
            Clear all
          </button>
      </div>
      <aside className="sticky top-20 hidden h-fit min-w-60 rounded-lg border border-light-300 bg-light-100 p-4 md:block">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-body-medium text-dark-900">Filters</h3>
          <button className="text-caption text-dark-700 underline" onClick={clearAll}>
            Clear all
          </button>
        </div>
         <FilterGroup
            title={`Gender ${activeCounts.gender ? `(${activeCounts.gender})` : ""}`}
            k="gender"
            expanded={expanded.gender}
            setExpanded={setExpanded}
        >
          <ul className="space-y-2">
            {GENDERS.map((g) => {
              const checked = getArrayParam(search, "gender").includes(g);
              return (
                <li key={g} className="flex items-center gap-2">
                  <input
                    id={`gender-${g}`}
                    type="checkbox"
                    className="h-4 w-4 accent-dark-900"
                    checked={checked}
                    onChange={() => onToggle("gender", g)}
                  />
                  <label htmlFor={`gender-${g}`} className="text-body text-dark-900">
                    {g[0].toUpperCase() + g.slice(1)}
                  </label>
                </li>
              );
            })}
          </ul>
        </FilterGroup>
         <FilterGroup 
            title={`Size ${activeCounts.size ? `(${activeCounts.size})` : ""}`}
            k="size"
            expanded={expanded.size}
            setExpanded={setExpanded}
        >
          <ul className="grid grid-cols-5 gap-2">
            {SIZES.map((s) => {
              const checked = getArrayParam(search, "size").includes(s);
              return (
                <li key={s}>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-dark-900"
                      checked={checked}
                      onChange={() => onToggle("size", s)}
                    />
                    <span className="text-body">{s}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </FilterGroup>

        <FilterGroup 
            title={`Color ${activeCounts.color ? `(${activeCounts.color})` : ""}`}
            k="color"
            expanded={expanded.color}
            setExpanded={setExpanded}>
          <ul className="grid grid-cols-2 gap-2">
            {COLORS.map((c) => {
              const checked = getArrayParam(search, "color").includes(c);
              return (
                <li key={c} className="flex items-center gap-2">
                  <input
                    id={`color-${c}`}
                    type="checkbox"
                    className="h-4 w-4 accent-dark-900"
                    checked={checked}
                    onChange={() => onToggle("color", c)}
                  />
                  <label htmlFor={`color-${c}`} className="text-body capitalize">
                    {c}
                  </label>
                </li>
              );
            })}
          </ul>
        </FilterGroup>

        <FilterGroup 
          title={`Price ${activeCounts.price ? `(${activeCounts.size})` : ""}`}
            k="price"
            expanded={expanded.price}
            setExpanded={setExpanded}
        >
          <ul className="space-y-2">
            {PRICES.map((p) => {
              const checked = getArrayParam(search, "price").includes(p.id);
              return (
                <li key={p.id} className="flex items-center gap-2">
                  <input
                    id={`price-${p.id}`}
                    type="checkbox"
                    className="h-4 w-4 accent-dark-900"
                    checked={checked}
                    onChange={() => onToggle("price", p.id)}
                  />
                  <label htmlFor={`price-${p.id}`} className="text-body">
                    {p.label}
                  </label>
                </li>
              );
            })}
          </ul>
        </FilterGroup>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-white"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[80%] overflow-auto bg-light-100 p-4 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-body-medium">Filters</h3>
              <button className="text-caption text-dark-700 underline" onClick={clearAll}>
                Clear all
              </button>
            </div>
            
            <div className="md:hidden">
             <FilterGroup
                title={`Gender ${activeCounts.gender ? `(${activeCounts.gender})` : ""}`}
                k="gender"
                expanded={expanded.gender}
                setExpanded={setExpanded}
            >
              <ul className="space-y-2">
                {GENDERS.map((g) => {
                  const checked = getArrayParam(search, "gender").includes(g);
                  return (
                    <li key={g} className="flex items-center gap-2">
                      <input
                        id={`gender-${g}`}
                        type="checkbox"
                        className="h-4 w-4 accent-dark-900"
                        checked={checked}
                        onChange={() => onToggle("gender", g)}
                      />
                      <label htmlFor={`gender-${g}`} className="text-body text-dark-900">
                        {g[0].toUpperCase() + g.slice(1)}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </FilterGroup>
            <FilterGroup 
            title={`Size ${activeCounts.size ? `(${activeCounts.size})` : ""}`}
            k="size"
            expanded={expanded.size}
            setExpanded={setExpanded}
        >
          <ul className="grid grid-cols-4 gap-2">
            {SIZES.map((s) => {
              const checked = getArrayParam(search, "size").includes(s);
              return (
                <li key={s}>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-dark-900"
                      checked={checked}
                      onChange={() => onToggle("size", s)}
                    />
                    <span className="text-body">{s}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </FilterGroup>

        <FilterGroup 
            title={`Color ${activeCounts.color ? `(${activeCounts.color})` : ""}`}
            k="color"
            expanded={expanded.color}
            setExpanded={setExpanded}>
          <ul className="grid grid-cols-2 gap-2">
            {COLORS.map((c) => {
              const checked = getArrayParam(search, "color").includes(c);
              return (
                <li key={c} className="flex items-center gap-2">
                  <input
                    id={`color-${c}`}
                    type="checkbox"
                    className="h-4 w-4 accent-dark-900"
                    checked={checked}
                    onChange={() => onToggle("color", c)}
                  />
                  <label htmlFor={`color-${c}`} className="text-body capitalize">
                    {c}
                  </label>
                </li>
              );
            })}
          </ul>
        </FilterGroup>

        <FilterGroup 
          title={`Price ${activeCounts.price ? `(${activeCounts.size})` : ""}`}
            k="price"
            expanded={expanded.price}
            setExpanded={setExpanded}
        >
          <ul className="space-y-2">
            {PRICES.map((p) => {
              const checked = getArrayParam(search, "price").includes(p.id);
              return (
                <li key={p.id} className="flex items-center gap-2">
                  <input
                    id={`price-${p.id}`}
                    type="checkbox"
                    className="h-4 w-4 accent-dark-900"
                    checked={checked}
                    onChange={() => onToggle("price", p.id)}
                  />
                  <label htmlFor={`price-${p.id}`} className="text-body">
                    {p.label}
                  </label>
                </li>
              );
            })}
          </ul>
        </FilterGroup>
            </div>
          </div>
        </div>
      )}
    </>  
  )
}

export default Filters