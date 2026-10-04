import { useCart } from '../contexts/cartContext';
import { useState } from 'react';
import { FaQrcode, FaMoneyBillAlt, FaCreditCard } from 'react-icons/fa';
import SafeImage from '../components/safeImage';

const MeusPedidosPage = () => {
  const { cartItems, addToCart, decreaseQuantity, removeFromCart, clearCart, getSalePrice } = useCart();
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const handleDelete = () => {
    const productId = cartItems[itemToDelete]?.id;
    if (productId !== undefined) {
      removeFromCart(productId);
    }
    setItemToDelete(null);
  };

  const handleOverlayClick = (e, closeFunc) => {
    if (e.target === e.currentTarget) {
      closeFunc();
    }
  };

  const handleSimulatePayment = (paymentMethod) => {
    const order = { number: `DRIP-${cartItems.map((item) => item.id).join("-")}`, paymentMethod, items: cartItems, total };
    setShowPaymentOptions(false);
    clearCart();
    setCompletedOrder(order);
  };

  const total = cartItems.reduce((sum, item) => sum + getSalePrice(item) * item.quantity, 0);

  return (
    <div className="px-10 py-6 relative">

      {completedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <p className="text-green-600 font-semibold">Pedido realizado com sucesso!</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">Obrigado pela compra</h2>
            <p className="text-sm text-gray-600 mt-3">Pedido <strong>{completedOrder.number}</strong> · {completedOrder.paymentMethod}</p>
            <ul className="my-4 border-y border-gray-200 py-3 space-y-2 text-sm text-gray-700">
              {completedOrder.items.map((item) => <li key={item.id} className="flex justify-between gap-4"><span>{item.quantity}× {item.name || item.title}</span><span>R$ {(getSalePrice(item) * item.quantity).toFixed(2)}</span></li>)}
            </ul>
            <p className="text-right text-lg font-bold text-primary">Total pago: R$ {completedOrder.total.toFixed(2)}</p>
            <button onClick={() => setCompletedOrder(null)} className="mt-6 w-full bg-pink-700 hover:bg-pink-800 text-white font-semibold py-3 rounded">Continuar comprando</button>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-primary mb-4">Meus Pedidos</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item, index) => (
              <li key={item?.id ?? index} className="flex items-center justify-between gap-4 rounded border bg-white p-4 shadow-sm">
                <div className="flex min-w-0 items-center gap-4">
                  <SafeImage src={item?.image || item?.images?.[0]?.src} alt={item?.name || item?.title || 'Produto'} className="h-20 w-20 shrink-0 rounded-md bg-gray-100 object-contain p-1" />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item?.name || item?.title || "Produto sem título"}</p>
                    <p className="text-sm text-gray-500">{item?.category || "Categoria desconhecida"}</p>
                    <p className="font-bold text-primary">R$ {getSalePrice(item).toFixed(2)} cada</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <button onClick={() => decreaseQuantity(item.id)} className="h-8 w-8 rounded border border-gray-300 hover:bg-gray-100" aria-label={`Diminuir quantidade de ${item.name}`}>−</button>
                      <span className="font-semibold" aria-label="Quantidade">{item.quantity}</span>
                      <button onClick={() => addToCart(item)} disabled={Number.isFinite(item.stock) && item.quantity >= item.stock} className="h-8 w-8 rounded border border-gray-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40" aria-label={`Aumentar quantidade de ${item.name}`}>+</button>
                      <span className="text-sm text-gray-600">Subtotal: R$ {(getSalePrice(item) * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setItemToDelete(index)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-right text-lg font-semibold text-primary">
            Total: R$ {total.toFixed(2)}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowPaymentOptions(true)}
              className="px-6 py-3 bg-pink-700 text-white rounded hover:bg-pink-900"
            >
              Finalizar Pedido
            </button>
          </div>

          {itemToDelete !== null && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={(e) => handleOverlayClick(e, () => setItemToDelete(null))}
            >
              <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center relative">
                <button
                  onClick={() => setItemToDelete(null)}
                  className="absolute top-2 right-3 text-gray-400 text-lg hover:text-gray-600"
                >
                  ×
                </button>
                <p className="mb-4 text-lg">Tem certeza que deseja excluir este item?</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Sim
                  </button>
                  <button
                    onClick={() => setItemToDelete(null)}
                    className="px-4 py-2 border border-gray-200 rounded hover:bg-gray-200"
                  >
                    Não
                  </button>
                </div>
              </div>
            </div>
          )}

          {showPaymentOptions && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={(e) => handleOverlayClick(e, () => setShowPaymentOptions(false))}
            >
              <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center relative">
                <button
                  onClick={() => setShowPaymentOptions(false)}
                  className="absolute top-2 right-3 text-gray-400 text-lg hover:text-gray-600"
                >
                  ×
                </button>
                <h2 className="text-xl font-semibold mb-4">Escolha o método de pagamento:</h2>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleSimulatePayment('Pix')}
                    className="flex items-center justify-center gap-2 bg-cyan-900 text-white px-4 py-2 rounded hover:bg-cyan-950"
                  >
                    <FaQrcode /> Pix
                  </button>
                  <button
                    onClick={() => handleSimulatePayment('Pix')}
                    className="flex items-center justify-center gap-2 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                  >
                    <FaCreditCard /> Cartão de Crédito
                  </button>
                  <button
                    onClick={() => handleSimulatePayment('Pix')}
                    className="flex items-center justify-center gap-2 bg-green-900 text-white px-4 py-2 rounded hover:bg-green-950"
                  >
                    <FaMoneyBillAlt /> Dinheiro
                  </button>
                </div>
                <button
                  onClick={() => setShowPaymentOptions(false)}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MeusPedidosPage;