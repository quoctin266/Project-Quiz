import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import "./ModalFormCreate.scss";
import { FcPlus } from "react-icons/fc";
import { postCreateNewUser } from "../../../../services/APIService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ModalFormCreate = (props) => {
  const [show, setShow] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");
  const [image, setImage] = useState("");

  const { t } = useTranslation();

  const handleClose = () => {
    setPreviewImage("");
    setUsername("");
    setPassword("");
    setEmail("");
    setRole("USER");
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

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmitAdd = async () => {
    if (!validateEmail(email)) {
      toast.error("Invalid email format!");
      return;
    }

    if (!username || !password || !email) {
      toast.error("Missing one or more fields!");
      return;
    }

    let data = await postCreateNewUser(username, password, email, role, image);

    if (data && data.DT) {
      toast.success("New user added successfully!");
      handleClose();
      await props.getDataPaginate(props.currentPage); //re-fetching listuser after adding a new user
    } else {
      toast.error(data.EM);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        <FcPlus /> {t("admin.manageUser.formCreate.openformButton")}
      </Button>

      <Modal show={show} onHide={handleClose} size="xl" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{t("admin.manageUser.formCreate.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>
                  {t("admin.manageUser.formCreate.usernameLabel")}
                </Form.Label>
                <Form.Control
                  placeholder={t(
                    "admin.manageUser.formCreate.usernamePlaceholder"
                  )}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>
                  {t("admin.manageUser.formCreate.passwordLabel")}
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder={t(
                    "admin.manageUser.formCreate.passwordPlaceholder"
                  )}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>
                  {t("admin.manageUser.formCreate.emailLabel")}
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder={t(
                    "admin.manageUser.formCreate.emailPlaceholder"
                  )}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>
                  {t("admin.manageUser.formCreate.roleLabel")}
                </Form.Label>
                <Form.Select onChange={(e) => setRole(e.target.value)}>
                  <option value="USER">
                    {t("admin.manageUser.formCreate.user")}
                  </option>
                  <option value="ADMIN">
                    {t("admin.manageUser.formCreate.admin")}
                  </option>
                </Form.Select>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group>
                <Form.Label>
                  {t("admin.manageUser.formCreate.imageLabel")}
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
                      {t("admin.manageUser.formCreate.previewImage")}
                    </span>
                  )}
                </div>
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("admin.manageUser.formCreate.closeButton")}
          </Button>
          <Button variant="primary" onClick={handleSubmitAdd}>
            {t("admin.manageUser.formCreate.saveButton")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalFormCreate;
