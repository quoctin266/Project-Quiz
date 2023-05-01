import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import "./ModalFormCreate.scss";
import { putUpdateUser } from "../../../../services/APIService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ModalFormUpdate = (props) => {
  const [show, setShow] = useState(false);
  const [previewImage, setPreviewImage] = useState(
    props.item.image ? `data:image/jpeg;base64,${props.item.image}` : ""
  ); //if user has image then preview it
  const [username, setUsername] = useState(props.item.username);
  const [role, setRole] = useState(props.item.role);
  const [image, setImage] = useState("");

  const { t } = useTranslation();

  const handleClose = () => {
    //closing without update, need to reset value
    setUsername(props.item.username);
    setRole(props.item.role);
    setImage("");
    setPreviewImage(
      props.item.image ? `data:image/jpeg;base64,${props.item.image}` : ""
    );
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
    if (!username) {
      toast.error("Missing username!");
      return;
    }

    let data = await putUpdateUser(props.item.id, username, role, image);

    if (data && data.DT) {
      toast.success("Updated successfully!");
      handleCloseAfterUpdate();
      await props.getDataPaginate(props.currentPage); //re-fetching listuser after updating a user
    } else {
      toast.error(data.EM);
    }
  };

  return (
    <>
      <Button variant="warning mx-3" onClick={handleShow}>
        {t("admin.manageUser.formUpdate.openformButton")}
      </Button>

      <Modal show={show} onHide={handleClose} size="xl" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{t("admin.manageUser.formUpdate.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>
                  {t("admin.manageUser.formUpdate.usernameLabel")}
                </Form.Label>
                <Form.Control
                  placeholder={t(
                    "admin.manageUser.formUpdate.usernamePlaceholder"
                  )}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>
                  {t("admin.manageUser.formUpdate.passwordLabel")}
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder={t(
                    "admin.manageUser.formUpdate.passwordPlaceholder"
                  )}
                  disabled
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={props.item.email}
                  disabled
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>
                  {t("admin.manageUser.formUpdate.roleLabel")}
                </Form.Label>
                <Form.Select
                  onChange={(e) => setRole(e.target.value)}
                  defaultValue={role}
                >
                  <option value="USER">
                    {t("admin.manageUser.formUpdate.user")}
                  </option>
                  <option value="ADMIN">
                    {t("admin.manageUser.formUpdate.admin")}
                  </option>
                </Form.Select>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group>
                <Form.Label>
                  {t("admin.manageUser.formUpdate.imageLabel")}
                </Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => handleOnchangeImage(e)}
                />
                <div className="image-preview mt-3">
                  {previewImage ? (
                    <Image src={previewImage} style={{ height: "20vh" }} />
                  ) : (
                    <span style={{ color: "rgb(180, 177, 177)" }}>
                      {t("admin.manageUser.formUpdate.previewImage")}
                    </span>
                  )}
                </div>
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("admin.manageUser.formUpdate.closeButton")}
          </Button>
          <Button variant="primary" onClick={handleSubmitUpdate}>
            {t("admin.manageUser.formUpdate.saveButton")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalFormUpdate;
