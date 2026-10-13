export default function Header({ cartCount, onGoTo, onNavigate, onOpenCart }) {
  return (
    <header>
      <div className="wrap">
        <div className="logo" onClick={() => onNavigate('shop')}>
          Nutri<b>Ratna</b>
        </div>
        <nav>
          <button onClick={() => onGoTo('shop')}>Shop</button>
          <button onClick={() => onGoTo('bulk')}>Wholesale</button>
          <button onClick={() => onNavigate('track')}>Track Order</button>
          <button onClick={() => onNavigate('admin')}>Admin</button>
        </nav>
        <button className="cartb" onClick={onOpenCart}>Cart ({cartCount})</button>
      </div>
    </header>
  );
}
