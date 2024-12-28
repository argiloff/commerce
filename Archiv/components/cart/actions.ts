'use server';

import { TAGS } from 'lib/constants';
import { addToCart, createCart, getCart, removeFromCart, updateCart } from 'lib/woocommerce'; // Aktualisiert
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function addItem(prevState: any, productId: string | undefined) {
  let cartId = (await cookies()).get('cartId')?.value;

  if (!cartId || !productId) {
    return 'Error adding item to cart';
  }

  try {
    await addToCart(cartId, [{ productId, quantity: 1 }]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, productId: string) {
  let cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    const cart = await getCart(cartId);

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.items.find((item) => item.product.id === productId);

    if (lineItem && lineItem.id) {
      await removeFromCart(cartId, [lineItem.id]);
      revalidateTag(TAGS.cart);
    } else {
      return 'Item not found in cart';
    }
  } catch (e) {
    console.error(e);
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    productId: string;
    quantity: number;
  }
) {
  let cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  const { productId, quantity } = payload;

  try {
    const cart = await getCart(cartId);

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.items.find((item) => item.product.id === productId);

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart(cartId, [lineItem.id]);
      } else {
        await updateCart(cartId, [
          {
            id: lineItem.id,
            productId,
            quantity
          }
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart(cartId, [{ productId, quantity }]);
    }

    revalidateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return 'Error updating item quantity';
  }
}

export async function redirectToCheckout() {
  let cartId = (await cookies()).get('cartId')?.value;
  let cart = await getCart(cartId);

  if (cart?.checkoutUrl) {
    redirect(cart.checkoutUrl);
  } else {
    return 'Error redirecting to checkout';
  }
}

export async function createCartAndSetCookie() {
  try {
    let cart = await createCart();
    (await cookies()).set('cartId', cart.id!);
  } catch (e) {
    console.error(e);
    return 'Error creating cart';
  }
}
