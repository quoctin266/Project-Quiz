import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ModalResult = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setShowModal, handleShowAnswers } = props;

  const handleShowAnswersButton = () => {
    handleShowAnswers();
    setShowModal(false);
  };

  return (
    <>
      <Modal show={props.showModal} backdrop="static">
        <Modal.Header closeButton={false}>
          <Modal.Title>{t("users.result.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {t("users.result.questionCount")}{" "}
            <b>{props.dataModal.countTotal}</b>
          </div>
          <div>
            {t("users.result.correctAnswerCount")}{" "}
            <b>{props.dataModal.countCorrect}</b>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => navigate("/user")}>
            {t("users.result.closeButton")}
          </Button>
          <Button variant="primary" onClick={handleShowAnswersButton}>
            {t("users.result.showAnswerButton")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalResult;
