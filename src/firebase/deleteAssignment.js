// firebase/deleteAssignment.js
import { doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { db } from "./firebase.js";

export const deleteAssignment = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this assignment?");
  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "assignments", id));
    toast.success("Assignment deleted");
  } catch (err) {
    console.error(err);
    toast.error("Error deleting assignment");
  }
};
