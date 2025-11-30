import { getShirt } from "@/lib/actions/shirt";
import CollapsibleSection from "@/components/CollapsibleSection";
import ProductGallery from "@/components/ProductGallery";
import { Suspense } from "react";
import Link from "next/link";
import SizePicker from "@/components/SizePicker";
import Image from "next/image";

type Gallery = string[];


function formatPrice(price: number | null | undefined) {
  if (price === null || price === undefined) return undefined;
  return `$${price.toFixed(2)}`;
}

const ShirtDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const shirt = await getShirt(id);



  

    if (!shirt) {
    return (
      <main className="mx-auto container pt-20 lg:pt-30 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen text-center">
      <h1 className="text-heading-3 text-dark-900">Product not found</h1>
      <p className="mt-2 text-body text-dark-700">The product you’re looking for doesn’t exist or may have been removed.</p>
      <div className="mt-6">
        <Link
          href="/shirts"
          className="inline-block rounded-full bg-dark-900 px-6 py-3 text-body-medium text-light-100 transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
        >
          Browse Shirts
        </Link>
      </div>

      </main>
    );
  }

 const gallery: string[] = shirt.images
  .sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
  })
  .map((img) => img.url);


  const defaultVariant = shirt.variants[0]
  
  const basePrice = defaultVariant ? Number(defaultVariant.price) : null;
  const salePrice = defaultVariant?.salePrice ? Number(defaultVariant.salePrice) : null;

  const displayPrice = salePrice !== null && !Number.isNaN(salePrice) ? salePrice : basePrice;

  const compareAt = salePrice !== null && !Number.isNaN(salePrice) ? basePrice : null;

  const discount =
    compareAt && displayPrice && compareAt > displayPrice
      ? Math.round(((compareAt - displayPrice) / compareAt) * 100)
      : null;


  return (
    <div className='mx-auto container pt-20 lg:pt-30 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen'>
      <nav className="py-4 text-caption text-dark-700">
        <Link href="/" className="hover:underline">Home</Link> / <Link href="/products" className="hover:underline">Products</Link> /{" "}
        <span className="text-dark-900">{shirt.name}</span>
      </nav>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_480px]">
        {gallery.length > 0 && (
          <ProductGallery shirtId={shirt.id} images={gallery} className="lg:sticky lg:top-6 "/> 
        )}
        

        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <h1 className="text-heading-3 text-dark-900">{shirt.name}</h1>
            {shirt.description && <p className="text-body text-dark-700">{shirt.description}</p>}
          </header>
           <div className="flex items-center gap-3">
            <p className="text-lead text-dark-900">{formatPrice(displayPrice)}</p>
            {compareAt && (
              <>
                <span className="text-body text-dark-700 line-through">{formatPrice(compareAt)}</span>
                {discount !== null && (
                  <span className="rounded-full border border-light-300 px-2 py-1 text-caption text-[--color-green]">
                    {discount}% off
                  </span>
                )}
              </>
            )}
          </div>
            <div className="p-4 space-y-3">
              <SizePicker />
            <p className="text-xl font-medium text-dark">Quantity</p>
            <div className="grid grid-cols-[100px_1fr] gap-3">
            <div>
              
              <input
                id="qty"
                type="number"
                min="1"
                max="100"
                step="1"
                defaultValue={1}
                className="
                  py-3 px-3
                  border border-muted-foreground
                  transition
                  hover:border-blue-500
                  focus:border-blue-500
                  focus:ring-2 focus:ring-blue-300
                  focus:outline-none
                "
              />
            </div>

           
            <button className="flex items-center justify-center gap-2 rounded-full bg-dark px-6 py-4 text-body-medium text-text-light transition hover:opacity-90 hover:cursor-pointer">
              <Image
                src={`/logos/nba/LosAngelesLakers.png`}
                alt={shirt.name}
                height={35} width={35}
                priority
              />
              Add to Cart
            </button>
            </div>
          
           
          </div>
          <CollapsibleSection title="Shipping" defaultOpen={false}>
            <p>Free standard shipping and free 30-day returns for Nike Members.</p>
          </CollapsibleSection>
          <CollapsibleSection title="Description" defaultOpen={false}>
            <p>{shirt.description}</p>
          </CollapsibleSection>
  
        </div>
      </div>
      <Suspense
        fallback={
          <section className="mt-16">
            <h2 className="mb-6 text-heading-3 text-dark">You Might Also Like</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-xl bg-light-200" />
              ))}
            </div>
          </section>
        }
      >
        
      </Suspense>
    </div>
  )
}

export default ShirtDetailPage
