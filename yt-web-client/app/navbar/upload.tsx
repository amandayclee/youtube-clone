'use client';

import React, { useState } from "react";
import { uploadVideo } from "../firebase/functions";
import styles from "./upload.module.css";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.item(0);
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !title) {
      alert("Please select a file and enter a title.");
      return;
    }

    try {
      const response = await uploadVideo(file, title, description);
      alert(`File uploaded successfully. Server responded with: ${JSON.stringify(response)}`);
      // Reset form
      setFile(null);
      setTitle("");
      setDescription("");
      // Reset file input
      const fileInput = document.getElementById('upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      alert(`Failed to upload file: ${error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.uploadForm}>
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

      <div className={styles.inputsContainer}> {/* 將標題和描述放入並排的容器 */}
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
        <button type="submit" className={styles.submitButton} disabled={!file || !title}>
          Upload Video
        </button>
      </div>
    </form>
  );
}
