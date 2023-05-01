import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import "./ModalFormCreate.scss";
import { useTranslation } from "react-i18next";

const ModalFormView = (props) => {
  const [show, setShow] = useState(false);
  const { username, email, role, image } = props.item;

  const { t } = useTranslation();
  const previewImage = image ? `data:image/jpeg;base64,${image}` : "";

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="secondary" onClick={handleShow}>
        {t("admin.manageUser.formView.openformButton")}
      </Button>

      <Modal show={show} onHide={handleClose} size="xl" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{t("admin.manageUser.formView.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>
                  {t("admin.manageUser.formView.usernameLabel")}
                </Form.Label>
                <Form.Control value={username} disabled />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>
                  {t("admin.manageUser.formView.roleLabel")}
                </Form.Label>
                <Form.Control value={role} disabled />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email} disabled />
              </Form.Group>
              <Form.Group as={Col}></Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group>
                <Form.Label>
                  {t("admin.manageUser.formView.imageLabel")}
                </Form.Label>
                <div className="image-preview mt-3">
                  {previewImage ? (
                    <Image src={previewImage} style={{ height: "20vh" }} />
                  ) : (
                    <span style={{ color: "rgb(180, 177, 177)" }}>
                      {t("admin.manageUser.formView.previewImage")}
                    </span>
                  )}
                </div>
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("admin.manageUser.formView.closeButton")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalFormView;
