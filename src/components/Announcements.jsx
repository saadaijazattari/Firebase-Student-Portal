import { useEffect, useState } from "react";
import { db } from "../firebase/firebase.js";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "announcements"),
        orderBy("createdAt", "desc") // latest first
      );

      const snapshot = await getDocs(q);
      setAnnouncements(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">


      <div className="max-w-5xl mx-auto p-6 grid gap-6">
        {announcements.length === 0 ? (
          <p className="text-center text-gray-500">No announcements yet</p>
        ) : (
          announcements.map(a => (
            <div key={a.id} className="bg-white p-5 rounded-2xl shadow">
              <h2 className="text-xl font-semibold">{a.title}</h2>
              <p className="text-gray-600 mt-2">{a.description}</p>

              {/* Images */}
              {a.imageUrls?.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {a.imageUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="announcement"
                      className="w-full h-40 object-cover rounded-xl"
                    />
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-400 mt-3">
                {a.createdAt?.toDate().toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
