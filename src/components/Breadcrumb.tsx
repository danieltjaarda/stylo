'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  currentPage: string;
}

export default function Breadcrumb({ items, currentPage }: BreadcrumbProps) {
  // Generate Schema.org BreadcrumbList
  useEffect(() => {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://deskna.nl"
        },
        ...items.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 2,
          "name": item.name,
          "item": `https://deskna.nl${item.href}`
        })),
        {
          "@type": "ListItem",
          "position": items.length + 2,
          "name": currentPage,
          "item": typeof window !== 'undefined' ? window.location.href : ''
        }
      ]
    };

    // Add schema to head if not already exists
    const existingSchema = document.querySelector('script[data-breadcrumb-schema]');
    if (existingSchema) {
      existingSchema.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-breadcrumb-schema', 'true');
    script.text = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(script);

    return () => {
      const schemaToRemove = document.querySelector('script[data-breadcrumb-schema]');
      if (schemaToRemove) {
        schemaToRemove.remove();
      }
    };
  }, [items, currentPage]);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
            {/* Home */}
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link 
                href="/" 
                className="text-gray-500 hover:text-gray-900 transition-colors font-medium"
                itemProp="item"
              >
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>

            {/* Intermediate items */}
            {items.map((item, index) => (
              <li key={item.href} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <div className="flex items-center space-x-2">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <Link
                    href={item.href}
                    className="text-gray-500 hover:text-gray-900 transition-colors font-medium"
                    itemProp="item"
                  >
                    <span itemProp="name">{item.name}</span>
                  </Link>
                </div>
                <meta itemProp="position" content={(index + 2).toString()} />
              </li>
            ))}

            {/* Current page */}
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <div className="flex items-center space-x-2">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 font-semibold" itemProp="name">
                  {currentPage}
                </span>
              </div>
              <meta itemProp="position" content={(items.length + 2).toString()} />
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
}






