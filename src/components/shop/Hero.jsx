import pouchPhoto from '../../assets/pouch.jpg';

export default function Hero({ onGoTo }) {
  return (
    <div className="hero">
      <div className="wrap">
        <div>
          <span className="tag">Pure · Raw · Farm-direct</span>
          <h1>The royal <i>superfood</i> of India</h1>
          <p>
            Hand-selected raw makhana (fox nuts) — crunchy, light and rich in protein. Delivered
            fresh across India, from 250 g pouches to 10 kg sacks.
          </p>
          <button className="btn gold" onClick={() => onGoTo('shop')}>Shop makhana</button>{' '}
          <button className="btn ghost light" onClick={() => onGoTo('bulk')}>Bulk orders</button>
        </div>
        <div className="art">
          <img src={pouchPhoto} alt="NutriRatna raw makhana pouch" />
        </div>
      </div>
    </div>
  );
}
