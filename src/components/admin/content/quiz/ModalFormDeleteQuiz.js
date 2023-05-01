import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { deleteQuiz } from "../../../../services/APIService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ModalFormDeleteQuiz = (props) => {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

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
        {t("admin.manageQuiz.quizTable.quizDelete.openformButton")}
      </Button>

      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            {t("admin.manageQuiz.quizTable.quizDelete.title")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t("admin.manageQuiz.quizTable.quizDelete.confirmMessage")}
          <br />
          {t("admin.manageQuiz.quizTable.quizDelete.name")}{" "}
          <b>{props.item.name}</b>
          <br />
          {t("admin.manageQuiz.quizTable.quizDelete.description")}{" "}
          <b>{props.item.description}</b>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("admin.manageQuiz.quizTable.quizDelete.cancelButton")}
          </Button>
          <Button variant="primary" onClick={handleSubmitDelete}>
            {t("admin.manageQuiz.quizTable.quizDelete.confirmButton")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalFormDeleteQuiz;
