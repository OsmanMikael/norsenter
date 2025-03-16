import React, { useState } from 'react';
import vipps from '../assets/vipps.png';
import { useAuth } from '../context/AuthContext';

const Donations = () => {
  const { isAdmin } = useAuth();

  // Tilstand for redigerbare felter
  const [vippsNumber, setVippsNumber] = useState('12345');
  const [accountNumber, setAccountNumber] = useState('98765432100');
  const [ibanNumber, setIbanNumber] = useState('NO9387012345678');
  const [swiftNumber, setSwiftNumber] = useState('DNBANOKK');
  const [bankName, setBankName] = useState('DNB Bank ASA');
  const [message, setMessage] = useState('Tusen takk for din støtte!');
  const [editing, setEditing] = useState(false);

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleSave = () => {
    setEditing(false);
  };

  return (
    <div className="container mt-4">
      <section className="donation-info">
        <h2>Donasjoner</h2>
        <div className='aya'> <p>بسم الله الرحمن الرحيم</p> 
﴿ إِنَّمَا يَعْمُرُ مَسَاجِدَ اللَّهِ مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ وَأَقَامَ الصَّلَاةَ وَآتَى الزَّكَاةَ وَلَمْ يَخْشَ إِلَّا اللَّهَ ۖ فَعَسَىٰ أُولَٰئِكَ أَن يَكُونُوا مِنَ الْمُهْتَدِينَ﴾
[ التوبة: 18]    </div>

        {isAdmin && (
          <button className="btn btn-primary mb-3" onClick={handleEditToggle}>
            {editing ? 'Avbryt redigering' : 'Rediger detaljer'}
          </button>
        )}

        {/* Doner via Vipps */}
        <div className="donation-section">
          <div className="alert alert-info">
            <img src={vipps} alt="Vipps Logo" width="30" height="30" className="d-inline-block mr-2" />
            <strong>Vipps:</strong>{' '}
            {editing ? (
              <input
                type="text"
                className="form-control"
                value={vippsNumber}
                onChange={(e) => setVippsNumber(e.target.value)}
              />
            ) : (
              vippsNumber
            )}
          </div>
        </div>

        {/* Kontonummer for bankoverføring */}
        <div className="donation-section">
          <div className="alert alert-info">
            <strong>Kontonummer:</strong>{' '}
            {editing ? (
              <input
                type="text"
                className="form-control"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            ) : (
              accountNumber
            )}
          </div>
        </div>

        {/* Donasjoner fra utlandet */}
        <div className="donation-section">
          <h3>Utlandet</h3>
          <div className="alert alert-info">
            <strong>Bank name:</strong>{' '}
            {editing ? (
              <input
                type="text"
                className="form-control"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            ) : (
              bankName
            )}
            <br />
            <strong>IBAN:</strong>{' '}
            {editing ? (
              <input
                type="text"
                className="form-control"
                value={ibanNumber}
                onChange={(e) => setIbanNumber(e.target.value)}
              />
            ) : (
              ibanNumber
            )}
            <br />
            <strong>SWIFT/BIC:</strong>{' '}
            {editing ? (
              <input
                type="text"
                className="form-control"
                value={swiftNumber}
                onChange={(e) => setSwiftNumber(e.target.value)}
              />
            ) : (
              swiftNumber
            )}
            <br />
            <strong>Message:</strong>{' '}
            {editing ? (
              <textarea
                className="form-control"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            ) : (
              message
            )}
          </div>
        </div>

        {editing && (
          <button className="btn btn-success" onClick={handleSave}>
            Lagre endringer
          </button>
        )}
      </section>
    </div>
  );
};

export default Donations;
