import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { deleteQuiz } from "../../../../services/APIService";
import { toast } from "react-toastify";

const ModalFormDeleteQuiz = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmitDelete = async () => {
    let data = await deleteQuiz(props.item.id);
    if (data && data.DT) {
      toast.success("Deleted successfully!");
      handleClose();
      await props.fetchQuiz(); //re-fetching after deleting a quiz
    } else {
      toast.error(data.EM);
    }
  };

  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        Delete
      </Button>

      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Confirm delete quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure to delete this quiz?
          <br />
          Name: <b>{props.item.name}</b>
          <br />
          Description: <b>{props.item.description}</b>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalFormDeleteQuiz;
