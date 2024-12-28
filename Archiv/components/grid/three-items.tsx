import { GridTileImage } from 'components/grid/tile';
import { getCollectionProducts } from 'lib/woocommerce'; // WooCommerce-Funktion importiert

import type { Product } from 'lib/woocommerce/types'; // Produkt-Typen aus WooCommerce importiert
import Link from 'next/link';

function ThreeItemGridItem({
  item,
  size,
  priority,
}: {
  item: Product;
  size: 'full' | 'half';
  priority?: boolean;
}) {
  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/product/${item.slug}`} // Verlinkung angepasst
        prefetch={true}
      >
        <GridTileImage
          src={item.image || ''} // Bildquelle aus WooCommerce
          fill
          sizes={
            size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'
          }
          priority={priority}
          alt={item.name} // Produktname als Alt-Text
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: item.name, // Produktname als Titel
            amount: item.price, // Preis des Produkts
            currencyCode: 'EUR', // Währungscode festgelegt
          }}
        />
      </Link>
    </div>
  );
}

export async function ThreeItemGrid() {
  const categoryId = 'VALID_CATEGORY_ID'; // Kategorie-ID für die Startseite
  console.log('Fetching products for category ID:', categoryId);

  const homepageItems = await getCollectionProducts({
    collectionId: categoryId, // Übergabe der Kategorie-ID
  });

  if (!homepageItems || homepageItems.length < 3) {
    console.error('Not enough products found for the grid');
    return null;
  }

  const [firstProduct, secondProduct, thirdProduct] = homepageItems;

  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
      <ThreeItemGridItem size="full" item={firstProduct} priority={true} />
      <ThreeItemGridItem size="half" item={secondProduct} priority={true} />
      <ThreeItemGridItem size="half" item={thirdProduct} />
    </section>
  );
}
