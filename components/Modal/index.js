import React, { useState } from 'react'
import Modal from 'react-modal';

const ModalConfirm = ({ text, text2 }) => {
  const [openModal, setOpenModal] = useState(false)
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }
  };


  function isOpen() {
    setOpenModal(true);
  }
  function isClose() {
    setOpenModal(false);
  }
  return (
    <Modal
      isOpen={openModal}
      onRequestClose={openModal}
      contentLabel="Example Modal"
      onRequestClose={isClose}
      style={customStyles}
    >
      <a onClick={isClose} href="#" className="flex justify-end m-0 p-0">
        <p className="flex-row-reverse">X</p>
      </a>

      <div className="p-5">
        <p>{text}</p>
        <p>{text2}</p>
      </div>
      <div className="p-5 flex justify-end">
        <button onClick={isClose}>Sim</button>
        <button className="ml-4" onClick={isClose}>Não</button>
      </div>
    </Modal>
  )
}

export default ModalConfirm
