import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllContacts, saveContact, deleteContact } from './db'; // Importer IndexedDB-funksjoner

const Contact = () => {
  const { isAdmin } = useAuth();

  // Tilstand for kontakter
  const [contacts, setContacts] = useState([]);

  const [address, setAddress] = useState('Nedre Rommen 7a, 0988 Oslo, Norge');
  const [email, setEmail] = useState('norsenter18f@gmail.com');
  const [editing, setEditing] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [editContact, setEditContact] = useState(null);

  // Hent kontakter fra IndexedDB ved montering
  useEffect(() => {
    const fetchContacts = async () => {
      const storedContacts = await getAllContacts();
      setContacts(storedContacts);
    };
    fetchContacts();
  }, []);

  const handleEditToggle = (contact) => {
    setEditing(true);
    setEditContact(contact);
  };

  const handleSave = async () => {
    let updatedContacts;
    if (editContact) {
      updatedContacts = contacts.map(contact =>
        contact.id === editContact.id ? editContact : contact
      );
      await saveContact(editContact);
    } else {
      const newContactWithId = { ...newContact, id: Date.now() };
      updatedContacts = [...contacts, newContactWithId];
      await saveContact(newContactWithId);
      setNewContact({ name: '', phone: '' });
    }
    setContacts(updatedContacts);
    setEditing(false);
    setEditContact(null);
  };

  const handleDelete = async (id) => {
    await deleteContact(id);
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    setContacts(updatedContacts);
  };

  const handleSaveAddressEmail = () => {
    setEditing(false);
  };

  return (
    <div className="home">
      <section className="contact-info">
        <h3>Kontaktinformasjon</h3>
        {isAdmin && (
                    <button className="btn btn-primary mb-3" onClick={() => setEditing(!editing)}>
                    {editing ? 'Avbryt redigering' : 'Rediger kontaktinformasjon'}
                  </button>
                )}
                <p><strong>Adresse:</strong> 
                  {editing ? (
                    <input
                      type="text"
                      className="form-control"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  ) : (
                    address
                  )}
                </p>
                <p><strong>E-post:</strong> 
                  {editing ? (
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  ) : (
                    email
                  )}
                </p>
                {editing && (
                  <button className="btn btn-success" onClick={handleSaveAddressEmail}>
                    Lagre endringer
                  </button>
                )}
                
                <h4>Kontakter</h4>
                {isAdmin && (
                  <button className="btn btn-primary mb-3" onClick={() => setEditing(true)}>
                    Legg til ny kontakt
                  </button>
                )}
                {contacts.map(contact => (
                  <div key={contact.id}>
                    <p><strong>Navn:</strong> {contact.name}</p>
                    <p><strong>Telefon:</strong> {contact.phone}</p>
                    {isAdmin && (
                      <>
                        <button className="btn btn-secondary mr-2" onClick={() => handleEditToggle(contact)}>Rediger</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(contact.id)}>Slett</button>
                      </>
                    )}
                  </div>
                ))}
                {editing && (
                  <div>
                    <h4>{editContact ? 'Rediger kontakt' : 'Legg til ny kontakt'}</h4>
                    <div className="form-group">
                      <label htmlFor="name">Navn:</label>
                      <input
                        type="text"
                        id="name"
                        className="form-control"
                        value={editContact ? editContact.name : newContact.name}
                        onChange={(e) => editContact
                          ? setEditContact({ ...editContact, name: e.target.value })
                          : setNewContact({ ...newContact, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Telefon:</label>
                      <input
                        type="text"
                        id="phone"
                        className="form-control"
                        value={editContact ? editContact.phone : newContact.phone}
                        onChange={(e) => editContact
                          ? setEditContact({ ...editContact, phone: e.target.value })
                          : setNewContact({ ...newContact, phone: e.target.value })}
                      />
                    </div>
                    <button className="btn btn-success" onClick={handleSave}>
                      Lagre endringer
                    </button>
                    <button className="btn btn-secondary ml-2" onClick={() => {
                      setEditing(false);
                      setEditContact(null);
                      setNewContact({ name: '', phone: '' });
                    }}>
                      Avbryt
                    </button>
                  </div>
                )}
              </section>
        
              <section className="location">
                <h3>Lokasjon</h3>
                <div className="map-container">
                  <iframe
                    title="Moske Lokasjon"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d21345.148973143268!2d10.733456!3d59.911491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46416e8b2e4e8b:0x8e2b2ad6!2sNedre%20Rommen%207a,%200988%20Oslo,%20Norge!5e0!3m2!1sen!2sno!4v1638612345678!5m2!1sen!2sno"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </section>
            </div>
          );
        };
        
        export default Contact