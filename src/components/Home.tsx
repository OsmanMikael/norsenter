import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import PrayerTimes from "./PrayerTimes.tsx";
import { FaWhatsapp } from "react-icons/fa";
import Donations from "./Donations.tsx";
import Medier from "./Medier.tsx";
import { getAllNews, saveNews, deleteNews } from "./firebase.tsx";
import { NewsItem } from "../types/Types.tsx";

const Home: React.FC = () => {
  const { isAdmin } = useAuth();
  const whatsappNumber = "+4792506096";

  const [news, setNews] = useState<NewsItem[]>([]);
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const storedNews = await getAllNews();
        setNews(storedNews);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchNews();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editMode && editItem) {
        const updatedItem = { id: editItem.id, title, date, content };
        await saveNews(updatedItem);
        const updatedNews = news.map((item) =>
          item.id === editItem.id ? updatedItem : item
        );
        setNews(updatedNews);
      } else {
        const newNews: Omit<NewsItem, "id"> = { title, date, content };
        const result = await saveNews(newNews);
        if (result.success && result.id) {
          setNews([...news, { ...newNews, id: result.id }]);
        }
      }
    } catch (error) {
      console.error("Error saving news:", error);
    } finally {
      setLoading(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setEditMode(false);
    setEditItem(null);
    setTitle("");
    setDate("");
    setContent("");
  };

  const handleEdit = (item: NewsItem) => {
    setTitle(item.title);
    setDate(item.date);
    setContent(item.content);
    setEditMode(true);
    setEditItem(item);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteNews(id);
      setNews(news.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting news:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-layout">
      <aside className="sidebar">
        <Donations />
      </aside>

      <div className="main-content">
        <h2 className="velkommen">Velkommen til Nor Senter</h2>
        <PrayerTimes />
        <Medier />

        <section className="news mb-4">
          <h3>Nyheter og kunngjøringer</h3>
          {isAdmin && (
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="form-group">
                <label htmlFor="title">Tittel:</label>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  value={title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">Dato:</label>
                <input
                  type="date"
                  id="date"
                  className="form-control"
                  value={date}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Kommentar:</label>
                <textarea
                  id="content"
                  className="form-control"
                  value={content}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {editMode ? "Oppdater nyhet" : "Legg til nyhet"}
              </button>

              {loading && (
                <div className="spinner-border mt-2" role="status">
                  <span className="sr-only">Laster...</span>
                </div>
              )}
            </form>
          )}

          <div className="row">
            {news.map((item) => (
              <div key={item.id} className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">{item.title}</h4>
                    <p className="card-text">
                      <strong>Dato:</strong> {item.date}
                    </p>
                    <p className="card-text">{item.content}</p>
                    {isAdmin && (
                      <>
                        <button
                          className="btn btn-secondary mr-2"
                          onClick={() => handleEdit(item)}
                        >
                          Rediger
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(item.id!)}
                        >
                          Slett
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </section>
      </div>

      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
      >
        <FaWhatsapp size={50} color="green" />
      </a>
    </div>
  );
};

export default Home;
