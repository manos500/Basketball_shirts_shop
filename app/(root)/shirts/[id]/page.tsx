import { getShirt } from "@/lib/actions/shirt";
import ShirtCard from "@/components/ShirtCard";

import ProductGallery from "@/components/ProductGallery";
import { Suspense } from "react";
import Link from "next/link";
import SizePicker from "@/components/SizePicker";
import Image from "next/image";
import ShirtDetail from "@/components/ShirtDetail";


type Gallery = string[];


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
        <ShirtDetail shirt={shirt} defaultVariant={defaultVariant} />
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
        <section className="mt-16">
          <h2 className="mb-6 text-heading-3 text-dark-900">You Might Also Like</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      
            <ShirtCard key={shirt.id} shirt={shirt} />
          </div>
        </section>
      </Suspense>
    </div>
  )
}

export default ShirtDetailPage
