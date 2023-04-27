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

const ModalFormUpdate = (props) => {
  const [show, setShow] = useState(false);
  const [previewImage, setPreviewImage] = useState(
    props.item.image ? `data:image/jpeg;base64,${props.item.image}` : ""
  ); //if user has image then preview it
  const [username, setUsername] = useState(props.item.username);
  const [role, setRole] = useState(props.item.role);
  const [image, setImage] = useState("");

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
        Update
      </Button>

      <Modal show={show} onHide={handleClose} size="xl" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Update User Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" disabled />
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
                <Form.Label>Role</Form.Label>
                <Form.Select
                  onChange={(e) => setRole(e.target.value)}
                  defaultValue={role}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </Form.Select>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group>
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => handleOnchangeImage(e)}
                />
                <div className="image-preview mt-3">
                  {previewImage ? (
                    <Image src={previewImage} style={{ height: "20vh" }} />
                  ) : (
                    <span style={{ color: "rgb(180, 177, 177)" }}>
                      Preview Image
                    </span>
                  )}
                </div>
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitUpdate}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalFormUpdate;
