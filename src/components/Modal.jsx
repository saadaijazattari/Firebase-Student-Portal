import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import AddAssignment from './AddAssignment';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function TransitionsModal({ open, handleOpen, setOpen }) {
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* Tailwind button */}
      <button
        onClick={handleOpen}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50"
      >
        Create Assignment
      </button>

      {/* Modal as sibling */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
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
