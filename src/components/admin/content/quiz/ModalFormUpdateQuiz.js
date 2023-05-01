import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import "./ModalFormStyle.scss";
import { toast } from "react-toastify";
import { putUpdateQuiz } from "../../../../services/APIService";
import { useTranslation } from "react-i18next";

const ModalFormUpdateQuiz = (props) => {
  const [show, setShow] = useState(false);
  const [previewImage, setPreviewImage] = useState(
    `data:image/jpeg;base64,${props.item.image}`
  );
  const [name, setName] = useState(props.item.name);
  const [description, setDescription] = useState(props.item.description);
  const [difficulty, setDifficulty] = useState(props.item.difficulty);
  const [image, setImage] = useState("");

  const { t } = useTranslation();

  const handleClose = () => {
    //closing without update, need to reset value
    setName(props.item.name);
    setDescription(props.item.description);
    setDifficulty(props.item.difficulty);
    setImage("");
    setPreviewImage(`data:image/jpeg;base64,${props.item.image}`);
    setShow(false);
  };

  const handleCloseAfterUpdate = () => {
    setImage("");
    setShow(false);
  };

  const handleShow = () => setShow(true);

  const handleOnchangeImage = (e) => {
    if (e.target.files.length > 0) {
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
    }
  };

  const handleSubmitUpdate = async () => {
    if (!name || !description) {
      toast.error("Missing one or more fields!");
      return;
    }

    let data = await putUpdateQuiz(
      props.item.id,
      description,
      name,
      difficulty,
      image
    );

    if (data && data.DT) {
      toast.success("Updated successfully!");
      handleCloseAfterUpdate();
      await props.fetchQuiz(); //re-fetching after updating a quiz
    } else {
      toast.error(data.EM);
    }
  };

  return (
    <>
      <Button variant="warning mx-2" onClick={handleShow}>
        {t("admin.manageQuiz.quizTable.quizUpdate.openformButton")}
      </Button>

      <Modal show={show} onHide={handleClose} size="xl" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            {t("admin.manageQuiz.quizTable.quizUpdate.title")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>
                  {t("admin.manageQuiz.quizTable.quizUpdate.nameLabel")}
                </Form.Label>
                <Form.Control
                  placeholder={t(
                    "admin.manageQuiz.quizTable.quizUpdate.namePlaceholder"
                  )}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>
                  {t("admin.manageQuiz.quizTable.quizUpdate.descriptionLabel")}
                </Form.Label>
                <Form.Control
                  placeholder={t(
                    "admin.manageQuiz.quizTable.quizUpdate.descriptionPlaceholder"
                  )}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3 ">
              <Form.Group as={Col}>
                <Form.Label>
                  {t("admin.manageQuiz.quizTable.quizUpdate.difficultyLabel")}
                </Form.Label>
                <Form.Select
                  onChange={(e) => setDifficulty(e.target.value)}
                  defaultValue={difficulty}
                >
                  <option value="EASY">
                    {t("admin.manageQuiz.quizTable.quizUpdate.easyOption")}
                  </option>
                  <option value="MEDIUM">
                    {t("admin.manageQuiz.quizTable.quizUpdate.mediumOption")}
                  </option>
                  <option value="HARD">
                    {t("admin.manageQuiz.quizTable.quizUpdate.hardOption")}
                  </option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col}></Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group>
                <Form.Label>
                  {t("admin.manageQuiz.quizTable.quizUpdate.imageLabel")}
                </Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => handleOnchangeImage(e)}
                />
                <div className="image-preview mt-3">
                  {previewImage && <Image src={previewImage} />}
                </div>
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("admin.manageQuiz.quizTable.quizUpdate.closeButton")}
          </Button>
          <Button variant="primary" onClick={handleSubmitUpdate}>
            {t("admin.manageQuiz.quizTable.quizUpdate.saveButton")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalFormUpdateQuiz;
