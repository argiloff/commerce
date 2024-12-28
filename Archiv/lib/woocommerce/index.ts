/**
 * Holt Produkte einer Sammlung basierend auf ihrer ID
 * @param collectionId - Die ID der Sammlung
 * @returns Eine Liste von Produkten
 */
export async function getCollectionProducts({
  collectionId,
}: {
  collectionId: string;
}) {
  if (!collectionId) {
    console.error('No collection ID provided');
    return [];
  }

  const query = /* GraphQL */ `
    query GetCollectionProducts($id: ID!) {
      productCategory(id: $id) {
        products {
          nodes {
            id
            name
            slug
            ... on SimpleProduct {
              price
            }
            ... on VariableProduct {
              price
            }
            image {
              sourceUrl
            }
          }
        }
      }
    }
  `;

  try {
    console.log('Fetching collection products with ID:', collectionId);

    const response = await fetch(process.env.WP_GRAPHQL_ENDPOINT!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          id: collectionId,
        },
      }),
    });

    const result = await response.json();

    if (
      !result ||
      !result.data ||
      !result.data.productCategory ||
      !result.data.productCategory.products
    ) {
      console.error('GraphQL response:', JSON.stringify(result, null, 2));
      console.error('Error fetching collection products:', result.errors || 'Products not found');
      return [];
    }

    return result.data.productCategory.products.nodes.map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image?.sourceUrl,
    }));
  } catch (error) {
    console.error('Error during fetch:', error);
    return [];
  }
}

/**
 * Holt Menüpunkte basierend auf einer Menü-ID
 * @param menuId - Die ID des Menüs
 * @returns Eine Liste von Menüpunkten oder ein leeres Array
 */
export async function getMenu(menuId: string) {
  if (!menuId) {
    console.error('No menu ID provided');
    return [];
  }

  const query = /* GraphQL */ `
    query GetMenu($id: ID!) {
      menu(id: $id) {
        menuItems {
          nodes {
            label
            url
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(process.env.WP_GRAPHQL_ENDPOINT!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { id: menuId },
      }),
    });

    const result = await response.json();

    // Prüfen, ob die Antwort Daten enthält
    if (!result || !result.data || !result.data.menu) {
      console.error('GraphQL response:', JSON.stringify(result, null, 2));
      console.error('Error fetching menu:', result.errors || 'Menu not found');
      return [];
    }

    // Menü-Items verarbeiten und zurückgeben
    return result.data.menu.menuItems.nodes.map((item: { label: string; url: string }) => ({
      title: item.label,
      path: item.url,
    }));
  } catch (error) {
    console.error('Error during fetch:', error);
    return [];
  }
}

/**
 * Fügt ein Produkt zum Warenkorb hinzu
 */
export async function addToCart(cartId: string, items: { productId: string; quantity: number }[]) {
  const mutation = /* GraphQL */ `
    mutation AddToCart($cartId: ID!, $items: [CartItemInput!]!) {
      addToCart(input: { cartId: $cartId, items: $items }) {
        cart {
          id
          items {
            id
            quantity
            product {
              id
              name
            }
          }
        }
      }
    }
  `;

  const response = await fetch(process.env.WP_GRAPHQL_ENDPOINT!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: mutation,
      variables: { cartId, items },
    }),
  });

  const { data } = await response.json();
  return data.addToCart.cart;
}

/**
 * Erstellt einen neuen Warenkorb
 */
export async function createCart() {
  const mutation = /* GraphQL */ `
    mutation CreateCart {
      createCart {
        cart {
          id
        }
      }
    }
  `;

  const response = await fetch(process.env.WP_GRAPHQL_ENDPOINT!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: mutation }),
  });

  const { data } = await response.json();
  return data.createCart.cart;
}

/**
 * Holt den aktuellen Warenkorb basierend auf der `cartId`
 * @param cartId - Die ID des Warenkorbs
 * @returns Der Warenkorb oder `null`, wenn kein Warenkorb gefunden wird
 */
export async function getCart(cartId: string) {
  // Fehler prüfen: cartId muss vorhanden sein
  if (!cartId) {
    console.warn('No cart ID provided');
    return null;
  }

  const query = /* GraphQL */ `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        items {
          id
          quantity
          product {
            id
            name
            price
            image {
              sourceUrl
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(process.env.WP_GRAPHQL_ENDPOINT!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { cartId },
      }),
    });

    // JSON-Ergebnis parsen
    const result = await response.json();

    // Fehler prüfen
    if (!result || !result.data || !result.data.cart) {
      console.error('GraphQL response:', JSON.stringify(result, null, 2));
      console.error('Error fetching cart:', result.errors || 'No cart found');
      return null;
    }

    // Erfolgreich: Warenkorb zurückgeben
    return result.data.cart;
  } catch (error) {
    // Fehlerprotokollierung
    console.error('Error during fetch:', error);
    return null;
  }
}

/**
 * Entfernt Produkte aus dem Warenkorb
 */
export async function removeFromCart(cartId: string, itemIds: string[]) {
  const mutation = /* GraphQL */ `
    mutation RemoveFromCart($cartId: ID!, $itemIds: [ID!]!) {
      removeFromCart(input: { cartId: $cartId, itemIds: $itemIds }) {
        cart {
          id
          items {
            id
          }
        }
      }
    }
  `;

  const response = await fetch(process.env.WP_GRAPHQL_ENDPOINT!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: mutation,
      variables: { cartId, itemIds },
    }),
  });

  const { data } = await response.json();
  return data.removeFromCart.cart;
}

/**
 * Aktualisiert die Menge eines Artikels im Warenkorb
 */
export async function updateCart(cartId: string, items: { id: string; quantity: number }[]) {
  const mutation = /* GraphQL */ `
    mutation UpdateCart($cartId: ID!, $items: [CartItemInput!]!) {
      updateCart(input: { cartId: $cartId, items: $items }) {
        cart {
          id
          items {
            id
            quantity
            product {
              id
              name
            }
          }
        }
      }
    }
  `;

  const response = await fetch(process.env.WP_GRAPHQL_ENDPOINT!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: mutation,
      variables: { cartId, items },
    }),
  });

  const { data } = await response.json();
  return data.updateCart.cart;
}
export async function getPage(slug: string) {
  const query = /* GraphQL */ `
    query GetPage($slug: String!) {
      page(where: { slug: $slug }) {
        title
        description: excerpt
      }
    }
  `;

  const response = await fetch(process.env.WP_GRAPHQL_ENDPOINT!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { slug },
    }),
  });

  const { data } = await response.json();
  return data.page || null;
}
/**
 * Holt Produkte basierend auf Filterkriterien
 * @param searchQuery - Suchbegriff
 * @param sort - Sortierkriterium
 * @param first - Anzahl der Produkte
 * @returns Eine Liste von Produkten
 */
export async function getProducts({
  searchQuery,
  sort = 'NAME',
  first = 12,
}: {
  searchQuery?: string;
  sort?: 'NAME' | 'PRICE' | 'RELEVANCE';
  first?: number;
}) {
  const query = /* GraphQL */ `
    query GetProducts($searchQuery: String, $sort: ProductsOrderByEnum, $first: Int) {
      products(where: { search: $searchQuery }, orderBy: { field: $sort, order: ASC }, first: $first) {
        nodes {
          id
          name
          slug
          price
          image {
            sourceUrl
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(process.env.WP_GRAPHQL_ENDPOINT!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { searchQuery, sort, first },
      }),
    });

    const result = await response.json();

    // Fehler prüfen
    if (!result || !result.data || !result.data.products) {
      console.error('GraphQL response:', JSON.stringify(result, null, 2));
      console.error('Error fetching products:', result.errors || 'Products not found');
      return [];
    }

    // Produkte zurückgeben
    return result.data.products.nodes.map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image?.sourceUrl,
    }));
  } catch (error) {
    console.error('Error during fetch:', error);
    return [];
  }
}
/**
 * Holt Sammlungen (Kategorien) aus WooCommerce
 * @returns Eine Liste von Sammlungen
 */
export async function getCollections() {
  const query = /* GraphQL */ `
    query GetCollections {
      productCategories(where: { hideEmpty: true }) {
        nodes {
          id
          name
          slug
        }
      }
    }
  `;

  try {
    const response = await fetch(process.env.WP_GRAPHQL_ENDPOINT!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    // Fehler prüfen
    if (!result || !result.data || !result.data.productCategories) {
      console.error('GraphQL response:', JSON.stringify(result, null, 2));
      console.error('Error fetching collections:', result.errors || 'Collections not found');
      return [];
    }

    // Kategorien zurückgeben
    return result.data.productCategories.nodes.map((category: any) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    }));
  } catch (error) {
    console.error('Error during fetch:', error);
    return [];
  }
}
/**
 * Holt eine einzelne Sammlung (Kategorie) basierend auf ihrem Slug
 * @param slug - Der Slug der Sammlung
 * @returns Die Sammlung oder `null`, wenn nicht gefunden
 */
export async function getCollection(slug: string) {
  const query = /* GraphQL */ `
    query GetCollection($slug: String!) {
      productCategory(where: { slug: $slug }) {
        id
        name
        description
        seo {
          title
          description
        }
      }
    }
  `;

  const response = await fetch(process.env.WP_GRAPHQL_ENDPOINT!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { slug },
    }),
  });

  const result = await response.json();

  if (!result || !result.data || !result.data.productCategory) {
    console.error('GraphQL response:', JSON.stringify(result, null, 2));
    console.error('Error fetching collection:', result.errors || 'Collection not found');
    return null;
  }

  return result.data.productCategory;
}

