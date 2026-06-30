import React, { useState } from "react";
import { addGalleryImages, uploadImage } from "../../services/galleryService";
import useToast from "../../hooks/useToast";
import "./AdminImageUploadPage.css";

const AdminImageUploadPage = () => {
  const toast = useToast();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [previewImages, setPreviewImages] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    setStatusMessage("");

    if (files.length === 0) {
      setPreviewImages([]);
      return;
    }

    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({ src: reader.result, alt: file.name });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(setPreviewImages);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFiles.length === 0) {
      setStatusMessage("Please choose one or more image files to upload.");
      return;
    }

    setUploading(true);
    setStatusMessage("");

    try {
      const uploadResults = [];

      for (const file of selectedFiles) {
        const result = await uploadImage({ file, caption: caption.trim() });
        uploadResults.push(result);
      }

      addGalleryImages(
        uploadResults.map((item, index) => ({
          src: item.url || item.imageUrl || item.path || "",
          alt: item.filename || item.name || selectedFiles[index]?.name || "Uploaded image",
          caption: caption.trim(),
        }))
      );

      const successMessage = `${uploadResults.length} image(s) uploaded successfully.`;
      setStatusMessage(successMessage);
      toast.success(successMessage);
      setSelectedFiles([]);
      setCaption("");
      setPreviewImages([]);
    } catch (error) {
      console.error(error);
      const errorMessage = error.message || "Could not upload images. Please try again.";
      setStatusMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-image-upload-page page-container py-5">
      <div className="page-card admin-image-upload-card">
        <h1 className="page-title">Admin Image Upload</h1>
        <p className="page-subtitle">
          Upload new gallery images for the public home page. Images are stored in the browser and shown automatically on the home page.
        </p>

        <form className="upload-form" onSubmit={handleSubmit}>
          <label className="file-input-label" htmlFor="gallery-upload">
            Choose image files
          </label>
          <input
            id="gallery-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />

          <label className="file-input-label" htmlFor="gallery-caption">
            Caption (optional)
          </label>
          <input
            id="gallery-caption"
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Enter a caption to display with these images"
          />

          {previewImages.length > 0 && (
            <div className="preview-grid" aria-live="polite">
              {previewImages.map((image, index) => (
                <div key={index} className="preview-item">
                  <img src={image.src} alt={image.alt} />
                  <small>{image.alt}</small>
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Images"}
          </button>

          {statusMessage && <p className="status-message">{statusMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminImageUploadPage;
