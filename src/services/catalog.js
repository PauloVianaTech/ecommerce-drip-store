import { api } from './api';

const fallbackImage = '/product-thumb-1.jpeg';

const isUsableImage = (value) => typeof value === 'string' && /^(https?:\/\/|data:image\/|\/)/i.test(value);

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const optionValues = (options, names) => {
  const option = options?.find(({ titulo, title }) =>
    names.includes(String(titulo || title || '').toLowerCase())
  );

  const values = option?.valores_do_produto ?? option?.values ?? option?.value;
  return Array.isArray(values) ? values : [];
};

export const normalizeProduct = (product) => {
  const images = (product.images || [])
    .map((image) => image.content || image.path || image.src)
    .filter(isUsableImage);
  const price = toNumber(product.preco ?? product.price);
  const possibleDiscount = toNumber(product.price_with_discount ?? product.priceDiscount, price);
  const options = product.options || [];

  return {
    id: product.id,
    name: product.nome ?? product.name ?? 'Produto',
    title: product.nome ?? product.title ?? product.name ?? 'Produto',
    reference: product.slug ? `Ref. ${product.slug.toUpperCase()}` : `Ref. PROD-${product.id}`,
    price,
    priceDiscount: possibleDiscount > 0 && possibleDiscount < price ? possibleDiscount : price,
    description: product.description || 'Produto disponível no catálogo.',
    image: images[0] || fallbackImage,
    images: (images.length ? images : [fallbackImage]).map((src) => ({ src })),
    category: product.categories?.[0]?.nome || product.category || 'Produto',
    categoryIds: product.category_ids || [],
    stock: product.stock ?? 0,
    enabled: product.enabled ?? true,
    brand: product.brand || 'Drip Store',
    gender: product.gender || 'Unissex',
    condition: product.condition || 'Novo',
    stars: toNumber(product.stars, 5),
    rating: toNumber(product.rating, 0),
    sizes: optionValues(options, ['tamanho', 'tamanhos']),
    colors: optionValues(options, ['cor', 'cores']),
    options,
  };
};

export const getProducts = async (params = {}) => {
  const { data } = await api.get('/produto/pesquisa', { params: { limit: -1, ...params } });
  return {
    ...data,
    data: (data.data || []).map(normalizeProduct),
  };
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/produto/${id}`);
  return normalizeProduct(data);
};
export const getCategories = async () => {
  const { data } = await api.get('/categoria/pesquisa', { params: { limit: -1 } });
  return data.data || [];
};