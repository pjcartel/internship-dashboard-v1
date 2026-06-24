import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createNotification } from "../utils/notifications";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchResources = async () => {
    const snapshot = await getDocs(collection(db, "resources"));
    setResources(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchResources(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setErrorMessage(""); setSuccessMessage("");

    if (!