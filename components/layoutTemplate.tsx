// components/layoutTemplate.tsx
// Standard layout container for app views, PDFs, and exports

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] text-[#1E1E1E] font-sans">
        <main className="max-w-5xl mx-auto p-6">{children}</main>
      </div>
    )
  }
  