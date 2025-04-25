import React, { useState, useEffect } from 'react';
import vipps from '../assets/vipps.png';
import { useAuth } from '../context/AuthContext';
import { db, doc, getDoc, setDoc } from './firebase';

const Donations = () => {
  const { isAdmin } = useAuth();

  const [vippsNumber, setVippsNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ibanNumber, setIbanNumber] = useState('');
  const [swiftNumber, setSwiftNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);

  // 🔹 Last inn eksisterende donasjonsdata fra Firestore
  useEffect(() => {
    const fetchDonationInfo = async () => {
      const docRef = doc(db, 'content', 'donationInfo');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setVippsNumber(data.vippsNumber || '');
        setAccountNumber(data.accountNumber || '');
        setIbanNumber(data.ibanNumber || '');
        setSwiftNumber(data.swiftNumber || '');
        setBankName(data.bankName || '');
        setMessage(data.message || '');
      }
    };

    fetchDonationInfo();
  }, []);

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleSave = async () => {
    const docRef = doc(db, 'content', 'donationInfo');
    try {
      await setDoc(docRef, {
        vippsNumber,
        accountNumber,
        ibanNumber,
        swiftNumber,
        bankName,
        message,
      });
      setEditing(false);
      alert("Endringer lagret!");
    } catch (error) {
      console.error("Feil ved lagring:", error);
      alert("Kunne ikke lagre endringer.");
    }
  };

  return (
    <div className="container mt-4">
      <section className="donation-info">
        <h2>Donasjoner</h2>
        <div className='aya'>
          <p>بسم الله الرحمن الرحيم</p>
          ﴿ إِنَّمَا يَعْمُرُ مَسَاجِدَ اللَّهِ مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ...﴾ [ التوبة: 18]
        </div>

        {isAdmin && (
          <button className="btn btn-primary mb-3" onClick={handleEditToggle}>
            {editing ? 'Avbryt redigering' : 'Rediger detaljer'}
          </button>
        )}

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
