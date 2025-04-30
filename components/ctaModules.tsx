// components/ctaModules.tsx
// Reusable card-style CTA module for use in Web, PDF, or app

type CTABlockProps = {
    title: string
    description: string
  }
  
  export function CTABlock({ title, description }: CTABlockProps) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition max-w-md">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-700">{description}</p>
      </div>
    )
  }
  