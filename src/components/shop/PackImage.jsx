import pouchPhoto from '../../assets/pouch.jpg';
import { POUCH_IDS } from '../../config/constants';
import Sack from './Sack';

/** Shows the pouch photo for small packs and the sack drawing for large packs. */
export default function PackImage({ sku }) {
  const isPouch = POUCH_IDS.includes(sku.id);
  return (
    <div className="pimg">
      {isPouch ? <img src={pouchPhoto} alt={`NutriRatna raw makhana pouch ${sku.label}`} /> : <Sack label={sku.label} />}
      <span className="pill pack-tag">{isPouch ? 'Pouch' : 'Sack'}</span>
    </div>
  );
}
