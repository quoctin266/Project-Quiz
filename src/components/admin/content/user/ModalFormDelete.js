import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { deleteUser } from "../../../../services/APIService";
import { toast } from "react-toastify";

const ModalFormDelete = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmitDelete = async () => {
    let data = await deleteUser(props.item.id);
    if (data && data.DT) {
      toast.success("Deleted successfully!");
      handleClose();
      await props.getDataPaginate(props.currentPage); //re-fetching listuser after deleting a user
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
          <Modal.Title>Confirm delete user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure to delete this user?
          <br />
          Email: <b>{props.item.email}</b>
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

export default ModalFormDelete;
