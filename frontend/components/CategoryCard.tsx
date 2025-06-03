// components/CategoryCard.tsx
import Link from 'next/link'
import Image from 'next/image'

interface Category {
  id: number
  name: string
  image: string
  href: string
  description: string
}

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={category.href} className="group relative overflow-hidden rounded-2xl card-hover">
      <div className="aspect-square relative">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold font-display">{category.name}</h3>
          <p className="text-sm opacity-90">{category.description}</p>
        </div>
      </div>
    </Link>
  )
}
