import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import AddAssignment from "./AddAssignment";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(92vw, 640px)",
  maxHeight: "90vh",
  overflowY: "auto",
  borderRadius: "16px",
  boxShadow: "0 22px 50px -12px rgba(15, 23, 42, 0.35)",
  p: 0,
  bgcolor: "transparent",
};

export default function TransitionsModal({ open, handleOpen, setOpen }) {
  const handleClose = () => setOpen(false);

  return (
    <>
      <button
        onClick={handleOpen}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-700 transition hover:bg-slate-50"
      >
        Create Assignment
      </button>

      <Modal
        aria-labelledby="assignment-modal-title"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: { timeout: 300 },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <AddAssignment handleClose={handleClose} />
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
