import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase.js";
import { doc, getDoc } from "firebase/firestore";

export const authListener = (navigate) => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      // ❌ Not logged in → only login/signup allowed
      const path = window.location.pathname;
      if (path !== "/" && path !== "/signup") {
        navigate("/");
      }
      return;
    }

    // ✅ Logged in → get role from Firestore
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const role = docSnap.data().role;
      const path = window.location.pathname;

      // ❌ Logged in user cannot open login/signup
      if (path === "/" || path === "/signup") {
        if (role === "student") navigate("/student");
        else if (role === "teacher") navigate("/teacher");
        else navigate("/admin");
      }
    }
  });
};
