const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    slug
    name
    price
    currencyCode
    image {
      sourceUrl
      altText
    }
  }
`;

export default productFragment;
