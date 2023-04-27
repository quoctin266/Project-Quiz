import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ModalResult = (props) => {
  const handleClose = () => props.setShowModal(false);

  return (
    <>
      <Modal show={props.showModal} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Test Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            Total Questions: <b>{props.dataModal.countTotal}</b>
          </div>
          <div>
            Total Correct Answers: <b>{props.dataModal.countCorrect}</b>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Show answers
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalResult;
