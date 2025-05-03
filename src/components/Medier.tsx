import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { getAllMedia, saveMedia, deleteMedia } from "./firebase.tsx";
import { Modal } from "bootstrap";
import { MediaItem } from "../types/Types.tsx";

const Medier: React.FC = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [mediaTitle, setMediaTitle] = useState<string>("");
  const [mediaDate, setMediaDate] = useState<string>("");
  const [mediaDescription, setMediaDescription] = useState<string>("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const storedMedia = await getAllMedia();
        setMedia(storedMedia);
      } catch (error) {
        console.error("Feil ved henting av media:", error);
      }
    };
    fetchMedia();
  }, []);

  const handleMediaEdit = (item: MediaItem) => {
    setMediaTitle(item.title || "");
    setMediaDate(item.date || "");
    setMediaDescription(item.description || "");
    setEditMode(true);
    setEditItem(item);
  };

  const handleMediaDelete = async (id: string, fileUrl: string) => {
    try {
      await deleteMedia(id, fileUrl);
      setMedia(media.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Feil ved sletting av media:", error);
      alert("Noe gikk galt ved sletting av media. Prøv igjen.");
    }
  };

  const handleMediaClick = (item: MediaItem) => {
    setSelectedMedia(item);
    const modalElement = document.getElementById("mediaModal");
    if (modalElement) {
      const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
      modal.show();
    }
  };

  const handleMediaSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!mediaFile && !editMode) {
      console.error("Ingen fil valgt, og vi er ikke i redigeringsmodus.");
      return;
    }

    const mediaItem: Partial<MediaItem> = {
      title: mediaTitle,
      date: mediaDate,
      description: mediaDescription,
      fileUrl: editMode && editItem ? editItem.fileUrl : undefined,
      filePath: editMode && editItem ? editItem.filePath : undefined,
      fileType: editMode && editItem ? editItem.fileType : undefined,
    };

    try {
      let result;
      if (editMode && editItem?.id) {
        result = await saveMedia(
          { id: editItem.id, ...mediaItem },
          mediaFile || undefined
        );
      } else {
        result = await saveMedia(mediaItem, mediaFile || undefined);
      }

      if (result.success) {
        const updatedMedia = await getAllMedia();
        setMedia(updatedMedia);
      }

      resetForm();
    } catch (error) {
      console.error("Feil ved lagring av media:", error);
      alert("Noe gikk galt ved lagring av media. Prøv igjen.");
    }
  };

  const resetForm = () => {
    setMediaTitle("");
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files[0]) {
                  setMediaFile(e.target.files[0]);
                }
              }}
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
                    <button
                      className="btn btn-secondary mr-2"
                      onClick={() => handleMediaEdit(item)}
                    >
                      Rediger
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        handleMediaDelete(item.id!, item.filePath ?? "")
                      }
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

      {/* Modal */}
      <div
        className="modal fade"
        id="mediaModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="mediaModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="mediaModalLabel">
                {selectedMedia?.title}
              </h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {selectedMedia?.fileType === "image" ? (
                <img
                  src={selectedMedia?.fileUrl}
                  className="img-fluid fixed-media-size"
                  alt={selectedMedia?.title}
                />
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
