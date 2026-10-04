import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProductListingList from '../components/AbaProdutos/productListingList';
import { products as fallbackProducts } from '../data/products';
import { getCategories, getProducts } from '../services/catalog';

const ProductPage = () => {
  const [order, setOrder] = useState('menor-preco');
  const [products, setProducts] = useState(fallbackProducts);
  const [categories, setCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 500 });
  const [minPriceInput, setMinPriceInput] = useState('0');
  const [maxPriceInput, setMaxPriceInput] = useState('500');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryFromUrl = searchParams.get('categoria') || '';
  const searchQuery = searchParams.get('filter')?.toLowerCase() || '';
  const [filters, setFilters] = useState(() => (
    categoryFromUrl ? [categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1).toLowerCase()] : []
  ));

  const clampPrice = (value) => Math.min(Math.max(value, priceBounds.min), priceBounds.max);
  const updateMinPrice = (value) => {
    const nextPrice = Math.min(clampPrice(value), maxPrice);
    setMinPrice(nextPrice);
    setMinPriceInput(String(nextPrice));
  };
  const updateMaxPrice = (value) => {
    const nextPrice = Math.max(clampPrice(value), minPrice);
    setMaxPrice(nextPrice);
    setMaxPriceInput(String(nextPrice));
  };
  const commitMinPrice = () => updateMinPrice(Number(minPriceInput));
  const commitMaxPrice = () => updateMaxPrice(Number(maxPriceInput));

  const priceRange = Math.max(priceBounds.max - priceBounds.min, 1);
  const minPricePercent = ((minPrice - priceBounds.min) / priceRange) * 100;
  const maxPricePercent = ((maxPrice - priceBounds.min) / priceRange) * 100;

  const categoryIds = categories
    .filter((category) => filters.includes(category.nome))
    .map((category) => category.id)
    .join(',');

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
    getProducts()
      .then(({ data }) => {
        const prices = data.map((product) => product.priceDiscount ?? product.price).filter(Number.isFinite);
        if (!prices.length) return;
        const bounds = { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
        setPriceBounds(bounds);
        setMinPrice(bounds.min);
        setMaxPrice(bounds.max);
        setMinPriceInput(String(bounds.min));
        setMaxPriceInput(String(bounds.max));
      })
      .catch(() => {
        const prices = fallbackProducts.map((product) => product.priceDiscount ?? product.price).filter(Number.isFinite);
        const bounds = { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
        setPriceBounds(bounds);
        setMinPrice(bounds.min);
        setMaxPrice(bounds.max);
        setMinPriceInput(String(bounds.min));
        setMaxPriceInput(String(bounds.max));
      });
  }, []);

  useEffect(() => {
    const params = {
      ...(searchQuery ? { match: searchQuery } : {}),
      ...(categoryIds ? { category_ids: categoryIds } : {}),
      'price-range': `${minPrice}-${maxPrice}`,
    };

    getProducts(params)
      .then(({ data }) => setProducts(data))
      .catch(() => setProducts(fallbackProducts));
  }, [searchQuery, categoryIds, minPrice, maxPrice]);

  const uniqueValues = (key) => [...new Set(products.map((product) => product[key]).filter(Boolean))];
  const allFilters = [
    { label: 'Categoria', property: 'category', options: categories.map((category) => category.nome) },
    { label: 'Marca', property: 'brand', options: uniqueValues('brand') },
    { label: 'Gênero', property: 'gender', options: uniqueValues('gender') },
    { label: 'Estado', property: 'condition', options: uniqueValues('condition') },
  ];

  const handleFilterChange = (value) => {
    setFilters((previous) => previous.includes(value)
      ? previous.filter((filter) => filter !== value)
      : [...previous, value]);
  };

  const processedProducts = (() => {
    const filtered = products.filter((product) => {
      const title = product.title?.toLowerCase() || '';
      const category = product.category?.toLowerCase() || '';
      const matchesSearch = !searchQuery || title.includes(searchQuery) || category.includes(searchQuery);
      const salePrice = product.priceDiscount ?? product.price;
      const matchesPrice = salePrice >= minPrice && salePrice <= maxPrice;
      const matchesFilter = allFilters.every(({ property, options }) => {
        const selectedOptions = options.filter((option) => filters.includes(option));
        return selectedOptions.length === 0 || selectedOptions.includes(product[property]);
      });
      return matchesSearch && matchesPrice && matchesFilter;
    });

    return [...filtered].sort((first, second) => (
      order === 'maior-preco' ? second.price - first.price : first.price - second.price
    ));
  })();

  return (
    <div className="flex flex-col md:flex-row gap-8 px-4 sm:px-6 md:px-10 py-6 w-full items-start">
      <aside className="w-full md:w-64 lg:w-72 flex-shrink-0 rounded-lg border border-gray-200 bg-white p-5 md:sticky md:top-4">
        <h3 className="text-gray-700 text-[16px] font-semibold mb-4">Filtrar por:</h3>
        <div className="mb-6 border-b pb-6">
          <h4 className="text-xs text-gray-600 font-semibold mb-3">Preço</h4>
          <div className="flex gap-2 mb-4">
            <label className="text-xs text-gray-600 flex-1">Mínimo<input type="number" min={priceBounds.min} max={maxPrice} value={minPriceInput} autoComplete="off" onChange={(event) => setMinPriceInput(event.target.value)} onBlur={commitMinPrice} className="mt-1 w-full border rounded px-2 py-1" /></label>
            <label className="text-xs text-gray-600 flex-1">Máximo<input type="number" min={minPrice} value={maxPriceInput} autoComplete="off" onChange={(event) => setMaxPriceInput(event.target.value)} onBlur={commitMaxPrice} className="mt-1 w-full border rounded px-2 py-1" /></label>
          </div>
          <div className="relative h-7">
            <div className="absolute top-3 h-1 w-full rounded-full bg-gray-200" aria-hidden="true" />
            <div className="absolute top-3 h-1 rounded-full bg-pink-600" style={{ left: `${minPricePercent}%`, width: `${maxPricePercent - minPricePercent}%` }} aria-hidden="true" />
            <input type="range" min={priceBounds.min} max={priceBounds.max} value={minPrice} onChange={(event) => updateMinPrice(Number(event.target.value))} className="pointer-events-none absolute top-0 z-20 h-7 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-pink-600 [&::-webkit-slider-thumb]:shadow-md" aria-label="Preço mínimo" />
            <input type="range" min={priceBounds.min} max={priceBounds.max} value={maxPrice} onChange={(event) => updateMaxPrice(Number(event.target.value))} className="pointer-events-none absolute top-0 z-10 h-7 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-pink-600 [&::-webkit-slider-thumb]:shadow-md" aria-label="Preço máximo" />
          </div>
          <p className="text-xs text-gray-500">De R$ {minPrice.toFixed(2)} até R$ {maxPrice.toFixed(2)}</p>
        </div>
        {allFilters.map((filter) => (
          <div key={filter.label} className="mb-6">
            <h4 className="text-xs text-gray-600 font-semibold mb-2">{filter.label}</h4>
            <div className="flex flex-col gap-2">
              {filter.options.map((option) => (
                <label key={option} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={filters.includes(option)} onChange={() => handleFilterChange(option)} className="w-4 h-4 accent-pink-500" />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </aside>
      <main className="flex-1 min-w-0 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <span className="text-sm text-gray-500">
            {filters.length === 0 ? <>Todos os produtos – <strong>{processedProducts.length}</strong> produto(s)</> : <>Resultados para <strong>{filters.join(', ')}</strong> – <strong>{processedProducts.length}</strong> produto(s)</>}
          </span>
          <div className="flex items-center gap-2">
            <label htmlFor="order" className="text-sm text-gray-600">Ordenar por:</label>
            <select id="order" value={order} onChange={(event) => setOrder(event.target.value)} className="h-[40px] border border-gray-300 rounded px-3 text-sm focus:ring-1 focus:ring-pink-500 outline-none">
              <option value="menor-preco">Menor preço</option>
              <option value="maior-preco">Maior preço</option>
            </select>
          </div>
        </div>
        <ProductListingList products={processedProducts} />
        <div className="flex justify-end mt-10 w-full border-t pt-6">
          <Link to="/pedidos" className="w-full sm:w-auto"><button className="w-full sm:w-auto px-8 py-3 bg-pink-700 hover:bg-pink-800 text-white font-semibold rounded shadow-md transition-all active:scale-95">Ir para o carrinho</button></Link>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;