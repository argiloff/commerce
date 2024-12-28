import { getCollectionProducts } from 'lib/woocommerce'; // Import aus WooCommerce
import Link from 'next/link';
import { GridTileImage } from './grid/tile';

export async function Carousel() {
  // WooCommerce-spezifische Anpassung: Ersetze die Kategorie durch eine gültige ID
  const categoryId = 'VALID_CATEGORY_ID'; // Ersetze durch die WooCommerce-Kategorie-ID
  console.log('Fetching products for carousel with category ID:', categoryId);

  const products = await getCollectionProducts({ collectionId: categoryId }); // Korrekte ID übergeben

  if (!products?.length) {
    console.error('No products found for the carousel');
    return null;
  }

  // Produkte duplizieren, um das Karussell nahtlos zu machen
  const carouselProducts = [...products, ...products, ...products];

  return (
    <div className="w-full overflow-x-auto pb-6 pt-1">
      <ul className="flex animate-carousel gap-4">
        {carouselProducts.map((product, i) => (
          <li
            key={`${product.slug}${i}`}
            className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
          >
            <Link href={`/product/${product.slug}`} className="relative h-full w-full">
              <GridTileImage
                alt={product.name}
                label={{
                  title: product.name,
                  amount: product.price,
                  currencyCode: 'EUR' // Währung festlegen, falls nicht vorhanden
                }}
                src={product.image} // Bild aus WooCommerce
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
