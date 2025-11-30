"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getArrayParam, removeParams, toggleArrayParam } from "@/lib/utils/query";
import FilterGroup from "./FilterGroup";

const BRANDS = ["nike", "adidas", "puma"] as const;
const LEAGUES = ["nba", "euroleague"] as const;
const TEAMS = ["lakers", "warriors", "barcelona"] as const;
const SIZES = ["S", "M", "L", "XL"] as const;
const PRICES = [
  { id: "0-50", label: "$0 - $50" },
  { id: "50-100", label: "$50 - $100" },
  { id: "100-150", label: "$100 - $150" },
  { id: "150-", label: "Over $150" },
] as const;

type GroupKey = "brand" | "league" | "team" | "size" | "price";

const Filters = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const search = useMemo(() => `?${searchParams.toString()}`, [searchParams]);

    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState<Record<GroupKey, boolean>>({
        brand: true,
        team: true,
        league: true,
        size: true,
        price: true,
    });

    const activeCounts = {
      brand: getArrayParam(search, "brand").length,
      league: getArrayParam(search, "league").length,
      team: getArrayParam(search, "team").length,
      size: getArrayParam(search, "size").length,
      price: getArrayParam(search, "price").length,
    };

    useEffect(() => {
        setOpen(false);
    }, [search]);

    const clearAll = () => {
      const url = removeParams(pathname, search, ["brand", "league", "team", "size", "price","page"]);
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
            title={`Brand ${activeCounts.brand ? `(${activeCounts.brand})` : ""}`}
            k="brand"
            expanded={expanded.brand}
            setExpanded={setExpanded}
        >
          <ul className="space-y-2">
            {BRANDS.map((b) => {
              const checked = getArrayParam(search, "brand").includes(b);
              return (
                <li key={b} className="flex items-center gap-2">
                  <input
                    id={`brand-${b}`}
                    type="checkbox"
                    className="h-4 w-4 accent-dark-900"
                    checked={checked}
                    onChange={() => onToggle("brand", b)}
                  />
                  <label htmlFor={`brand-${b}`} className="text-body text-dark-900">
                    {b[0].toUpperCase() + b.slice(1)}
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
            title={`League ${activeCounts.league ? `(${activeCounts.league})` : ""}`}
            k="league"
            expanded={expanded.league}
            setExpanded={setExpanded}>
          <ul className="grid grid-cols-2 gap-2">
            {LEAGUES.map((l) => {
              const checked = getArrayParam(search, "league").includes(l);
              return (
                <li key={l} className="flex items-center gap-2">
                  <input
                    id={`league-${l}`}
                    type="checkbox"
                    className="h-4 w-4 accent-dark-900"
                    checked={checked}
                    onChange={() => onToggle("league", l)}
                  />
                  <label htmlFor={`league-${l}`} className="text-body capitalize">
                    {l}
                  </label>
                </li>
              );
            })}
          </ul>
        </FilterGroup>
        <FilterGroup 
            title={`Team ${activeCounts.team ? `(${activeCounts.league})` : ""}`}
            k="team"
            expanded={expanded.team}
            setExpanded={setExpanded}>
          <ul className="grid grid-cols-2 gap-2">
            {TEAMS.map((t) => {
              const checked = getArrayParam(search, "team").includes(t);
              return (
                <li key={t} className="flex items-center gap-2">
                  <input
                    id={`team-${t}`}
                    type="checkbox"
                    className="h-4 w-4 accent-dark-900"
                    checked={checked}
                    onChange={() => onToggle("team", t)}
                  />
                  <label htmlFor={`team-${t}`} className="text-body capitalize">
                    {t}
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
            title={`Brand ${activeCounts.brand ? `(${activeCounts.brand})` : ""}`}
            k="brand"
            expanded={expanded.brand}
            setExpanded={setExpanded}
        >
          <ul className="space-y-2">
            {BRANDS.map((b) => {
              const checked = getArrayParam(search, "brand").includes(b);
              return (
                <li key={b} className="flex items-center gap-2">
                  <input
                    id={`brand-${b}`}
                    type="checkbox"
                    className="h-4 w-4 accent-dark-900"
                    checked={checked}
                    onChange={() => onToggle("brand", b)}
                  />
                  <label htmlFor={`brand-${b}`} className="text-body text-dark-900">
                    {b[0].toUpperCase() + b.slice(1)}
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
            title={`League ${activeCounts.league ? `(${activeCounts.league})` : ""}`}
            k="league"
            expanded={expanded.league}
            setExpanded={setExpanded}>
          <ul className="grid grid-cols-2 gap-2">
            {LEAGUES.map((l) => {
              const checked = getArrayParam(search, "league").includes(l);
              return (
                <li key={l} className="flex items-center gap-2">
                  <input
                    id={`league-${l}`}
                    type="checkbox"
                    className="h-4 w-4 accent-dark-900"
                    checked={checked}
                    onChange={() => onToggle("league", l)}
                  />
                  <label htmlFor={`league-${l}`} className="text-body capitalize">
                    {l}
                  </label>
                </li>
              );
            })}
          </ul>
        </FilterGroup>
        <FilterGroup 
            title={`Team ${activeCounts.team ? `(${activeCounts.league})` : ""}`}
            k="team"
            expanded={expanded.team}
            setExpanded={setExpanded}>
          <ul className="grid grid-cols-2 gap-2">
            {TEAMS.map((t) => {
              const checked = getArrayParam(search, "team").includes(t);
              return (
                <li key={t} className="flex items-center gap-2">
                  <input
                    id={`team-${t}`}
                    type="checkbox"
                    className="h-4 w-4 accent-dark-900"
                    checked={checked}
                    onChange={() => onToggle("team", t)}
                  />
                  <label htmlFor={`team-${t}`} className="text-body capitalize">
                    {t}
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