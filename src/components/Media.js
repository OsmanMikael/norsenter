import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllMedia, saveMedia, deleteMedia } from './db'; // Importer IndexedDB-funksjoner

const Medier = () => {
  const [media, setMedia] = useState([]);
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaDate, setMediaDate] = useState("");
  const [mediaDescription, setMediaDescription] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchMedia = async () => {
      const storedMedia = await getAllMedia();
      setMedia(storedMedia);
    };
    fetchMedia();
  }, []);

  const handleMediaEdit = (item) => {
    setMediaTitle(item.title);
    setMediaDate(item.date);
    setMediaDescription(item.description);
    setEditMode(true);
    setEditItem(item);
  };

  const handleMediaDelete = async (id) => {
    await deleteMedia(id);
    const updatedMedia = media.filter((item) => item.id !== id);
    setMedia(updatedMedia);
  };

  const handleMediaClick = (item) => {
    setSelectedMedia(item);
    const modal = new window.bootstrap.Modal(document.getElementById("mediaModal"));
    modal.show();
  };

  const handleMediaSubmit = async (e) => {
    e.preventDefault();

    if (!mediaFile && !editMode) return;

    const processFile = () => {
      if (editMode && !mediaFile) {
        const updatedMedia = media.map((item) =>
          item.id === editItem.id
            ? { ...item, title: mediaTitle, date: mediaDate, description: mediaDescription }
            : item
        );
        saveMedia({ id: editItem.id, title: mediaTitle, date: mediaDate, description: mediaDescription, fileUrl: editItem.fileUrl, fileType: editItem.fileType });
        setMedia(updatedMedia);
        resetForm();
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const fileData = reader.result; // Base64-data
        const fileType = mediaFile?.type?.startsWith("video") ? "video" : "image";

        let updatedMedia;
        if (editMode && editItem) {
          updatedMedia = media.map((item) =>
            item.id === editItem.id
              ? { ...item, title: mediaTitle, date: mediaDate, description: mediaDescription, fileUrl: fileData, fileType }
              : item
          );
        } else {
          const newMedia = {
            id: Date.now(),
            title: mediaTitle,
            date: mediaDate,
            description: mediaDescription,
            fileUrl: fileData,
            fileType,
          };
          updatedMedia = [...media, newMedia];
        }

        await saveMedia(updatedMedia[updatedMedia.length - 1]);
        setMedia(updatedMedia);
        resetForm();
      };

      reader.readAsDataURL(mediaFile);
    };

    processFile();
  };

  const resetForm = () => {
    setMediaTitle("");
    setMediaDate("");
    setMediaDescription("");
    setMediaFile(null);
    setEditMode(false);
    setEditItem(null);
  };

  return (
    <section className="news mb-4">
      <h3>Medier</h3>
      {isAdmin && (
        <form onSubmit={handleMediaSubmit} className="mb-4">
          <div className="form-group">
            <label htmlFor="mediaTitle">Tittel:</label>
            <input
              type="text"
              id="mediaTitle"
              className="form-control"
              value={mediaTitle}
              onChange={(e) => setMediaTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="mediaDate">Dato:</label>
            <input
              type="date"
              id="mediaDate"
              className="form-control"
              value={mediaDate}
              onChange={(e) => setMediaDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="mediaDescription">Beskrivelse:</label>
            <textarea
              id="mediaDescription"
              className="form-control"
              value={mediaDescription}
              onChange={(e) => setMediaDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="mediaFile">Fil:</label>
            <input
              type="file"
              id="mediaFile"
              className="form-control"
              onChange={(e) => setMediaFile(e.target.files[0])}
              accept="image/*,video/*"
              required={!editMode}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editMode ? "Oppdater media" : "Last opp"}
          </button>
        </form>
      )}

      <div className="row">
        {media.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">{item.title}</h4>
                {item.fileType === "image" ? (
                  <img
                    src={item.fileUrl}
                    className="card-img-top fixed-media-size"
                    alt={item.title}
                    onClick={() => handleMediaClick(item)}
                  />
                ) : (
                  <video controls className="fixed-media-size">
                    <source src={item.fileUrl} type="video/mp4" />
                    Din nettleser støtter ikke videoavspillinger.
                  </video>
                )}
                <p className="card-text">{item.description}</p>
                {isAdmin && (
                  <>
                    <button className="btn btn-secondary mr-2" onClick={() => handleMediaEdit(item)}>
                      Rediger
                    </button>
                    <button className="btn btn-danger" onClick={() => handleMediaDelete(item.id)}>
                      Slett
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for visning */}
      <div className="modal fade" id="mediaModal" tabIndex="-1" role="dialog" aria-labelledby="mediaModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="mediaModalLabel">{selectedMedia?.title}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {selectedMedia?.fileType === "image" ? (
                <img src={selectedMedia?.fileUrl} className="img-fluid fixed-media-size" alt={selectedMedia?.title} />
              ) : (
                <video controls className="custom-video fixed-media-size">
                  <source src={selectedMedia?.fileUrl} type="video/mp4" />
                  Din nettleser støtter ikke videoavspillinger.
                </video>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Medier;