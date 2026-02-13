import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase.js";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { uploadImages, uploadPDFs } from "../cloudinary/cloudinary";

export default function ClassMessages() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [images, setImages] = useState([]);
  const [pdfs, setPDFs] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const user = auth.currentUser;
  const userName = user.displayName || user.email?.split("@")[0] || "Anonymous";

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "classMessages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!user) return;
    if (!message.trim() && images.length === 0 && pdfs.length === 0) return;

    let imageUrls = [];
    let pdfUrls = [];

    try {
      if (images.length > 0) imageUrls = await uploadImages(images);
      if (pdfs.length > 0) pdfUrls = await uploadPDFs(pdfs);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload files");
      return;
    }

    await addDoc(collection(db, "classMessages"), {
      senderId: user.uid,
      senderName: userName,
      text: message,
      imageUrls,
      pdfUrls,
      createdAt: serverTimestamp(),
    });

    setMessage("");
    setImages([]);
    setPDFs([]);
  };

  if (!user) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-100 px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-600 shadow-sm">
          Loading chat...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-200">Classroom</p>
            <h1 className="mt-1 text-2xl font-semibold">Class Messages</h1>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Back
          </button>
        </div>
      </div>

      <div className="mx-auto flex h-[calc(100vh-96px)] w-full max-w-5xl flex-col px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex-1 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                No messages yet. Start the conversation.
              </div>
            )}

            {messages.map((msg) => {
              const isMe = msg.senderId === user.uid;
              const bubbleClass = isMe
                ? "bg-emerald-500 text-white border-emerald-400"
                : "bg-slate-50 text-slate-800 border-slate-200";

              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`w-full max-w-sm rounded-2xl border p-3 shadow-sm sm:max-w-md ${bubbleClass}`}>
                    <p className={`text-xs font-semibold ${isMe ? "text-emerald-100" : "text-slate-500"}`}>
                      {isMe ? "You" : msg.senderName || "Unknown"}
                    </p>

                    {msg.text && <p className="mt-1 text-sm leading-relaxed">{msg.text}</p>}

                    {msg.imageUrls?.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {msg.imageUrls.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`message-img-${idx}`}
                            className="h-24 w-full rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    )}

                    {msg.pdfUrls?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {msg.pdfUrls.map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                              isMe
                                ? "bg-white/20 text-white hover:bg-white/30"
                                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            PDF {idx + 1}
                          </a>
                        ))}
                      </div>
                    )}

                    <span className={`mt-2 block text-right text-[11px] ${isMe ? "text-emerald-100" : "text-slate-400"}`}>
                      {msg.createdAt?.toDate
                        ? msg.createdAt.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : ""}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              onClick={handleSend}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Send
            </button>
          </div>

          <div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
            <label className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2">
              <span className="font-medium text-slate-600">Images:</span>{" "}
              {images.length > 0 ? `${images.length} selected` : "None"}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(Array.from(e.target.files || []))}
                className="mt-2 block w-full text-xs"
              />
            </label>

            <label className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2">
              <span className="font-medium text-slate-600">PDFs:</span>{" "}
              {pdfs.length > 0 ? `${pdfs.length} selected` : "None"}
              <input
                type="file"
                multiple
                accept="application/pdf"
                onChange={(e) => setPDFs(Array.from(e.target.files || []))}
                className="mt-2 block w-full text-xs"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
