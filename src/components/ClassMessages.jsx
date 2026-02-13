// ClassMessages.jsx
import React, { useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase/firebase.js";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { uploadImages, uploadPDFs } from "../cloudinary/cloudinary";

export default function ClassMessages() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [images, setImages] = useState([]);
  const [pdfs, setPDFs] = useState([]);
  const scrollRef = useRef(null);

  const user = auth.currentUser;
  if (!user) return <p>Loading user...</p>;

  // Determine display name
  const userName =
    user.displayName || user.email?.split("@")[0] || "Anonymous";

  // Fetch messages live
  useEffect(() => {
    const q = query(
      collection(db, "classMessages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() && images.length === 0 && pdfs.length === 0) return;

    let imageUrls = [];
    let pdfUrls = [];

    try {
      if (images.length > 0) {
        imageUrls = await uploadImages(images);
      }
      if (pdfs.length > 0) {
        pdfUrls = await uploadPDFs(pdfs);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload files");
      return;
    }

    await addDoc(collection(db, "classMessages"), {
      senderId: user.uid,
      senderName: userName, // ✅ actual name
      text: message,
      imageUrls,
      pdfUrls,
      createdAt: serverTimestamp(),
    });

    setMessage("");
    setImages([]);
    setPDFs([]);
  };

  return (
    <div className="flex h-screen flex-col bg-slate-100">
      {/* Header */}
      <div className="bg-emerald-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-semibold">Class Chat</h1>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === user.uid;
            console.log("--- Message Check ---");
  console.log("Message Text:", msg.text);
  console.log("Firestore SenderID:", msg.senderId);
  console.log("Your Current UID:", user.uid);
  console.log("Is it Me?:", isMe);


          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-2xl p-3 ${
                  isMe ? "bg-emerald-500 text-white" : "bg-white text-slate-800"
                } shadow`}
              >
                {/* Name */}
                <p className="text-xs font-semibold mb-1">
                  {isMe ? "You" : msg.senderName || "Unknown"}
                </p>

                {/* Text */}
                {msg.text && <p className="text-sm">{msg.text}</p>}

                {/* Images */}
                {msg.imageUrls?.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {msg.imageUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`img-${idx}`}
                        className="h-24 w-full object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {/* PDFs */}
                {msg.pdfUrls?.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {msg.pdfUrls.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-slate-200 px-3 py-1 rounded-lg text-xs text-slate-800 hover:bg-slate-300"
                      >
                        PDF {idx + 1}
                      </a>
                    ))}
                  </div>
                )}

                {/* Time */}
                <span className="mt-1 block text-xs text-slate-400 text-right">
                  {msg.createdAt?.toDate
                    ? msg.createdAt
                        .toDate()
                        .toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                    : ""}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef}></div>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-300 bg-white p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 rounded-full border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            onClick={handleSend}
            className="rounded-full bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700"
          >
            Send
          </button>
        </div>

        {/* File Uploads */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files))}
          />
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={(e) => setPDFs(Array.from(e.target.files))}
          />
        </div>
      </div>
    </div>
  );
}
