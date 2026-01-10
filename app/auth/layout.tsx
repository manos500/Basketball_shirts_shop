const Authlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <section className="hidden lg:flex flex-col justify-between bg-dark text-text-light p-10">
        <div className="flex items-center">
          <h1 className="text-heading-2 font-bold tracking-wide">CourtStyle</h1>
        </div>

        <div className="space-y-4">
          <h2 className="text-heading-2 font-semibold">Own the Court</h2>
          <p className="max-w-md text-lead text-light-300">
            Step up your game with exclusive basketball jerseys and streetwear 
            made for real players — on and off the court.
          </p>

          <div className="flex gap-2" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-light-100/90" />
            <span className="h-2 w-2 rounded-full bg-light-100/50" />
            <span className="h-2 w-2 rounded-full bg-light-100/50" />
          </div>
        </div>

        <p className="text-footnote text-light-400">
          © 2025 CourtStyle. All rights reserved.
        </p>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 bg-light">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
};

export default Authlayout;
