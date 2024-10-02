'use client';

import React, { useState } from "react";
import { uploadVideo } from "../firebase/functions";
import styles from "./upload.module.css";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.item(0);
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.item(0);
    if (selectedFile) {
      setThumbnail(selectedFile);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !title || !thumbnail) {
      alert("Please select a video file, thumbnail, and enter a title.");
      return;
    }

    try {
      const response = await uploadVideo(file, thumbnail, title, description);
      alert(`File uploaded successfully. Server responded with: ${JSON.stringify(response)}`);
      // Reset form
      setFile(null);
      setThumbnail(null);
      setTitle("");
      setDescription("");
      // Reset file inputs
      const fileInput = document.getElementById('upload') as HTMLInputElement;
      const thumbnailInput = document.getElementById('thumbnail') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      if (thumbnailInput) thumbnailInput.value = '';
    } catch (error) {
      alert(`Failed to upload file: ${error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.uploadForm}>
      <div className={styles.fileInputsContainer}>
        <div className={styles.fileInputWrapper}>
          <input 
            id="upload" 
            className={styles.uploadInput} 
            type="file" 
            accept="video/*" 
            onChange={handleFileChange} 
          />
          <label htmlFor="upload" className={styles.uploadButton}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
            {file ? file.name : 'Choose Video'}
          </label>
        </div>

        <div className={styles.fileInputWrapper}>
          <input 
            id="thumbnail" 
            className={styles.uploadInput} 
            type="file" 
            accept="image/*" 
            onChange={handleThumbnailChange} 
          />
          <label htmlFor="thumbnail" className={styles.uploadButton}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {thumbnail ? thumbnail.name : 'Choose Thumbnail'}
          </label>
        </div>
      </div>

      <div className={styles.inputsContainer}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Video Title"
          required
          className={styles.titleInput}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Video Description (optional)"
          className={styles.descriptionInput}
        />
        <button type="submit" className={styles.submitButton} disabled={!file || !thumbnail || !title}>
          Upload Video
        </button>
      </div>
    </form>
  );
}
