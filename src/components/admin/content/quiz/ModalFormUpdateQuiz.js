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

const ModalFormUpdateQuiz = (props) => {
  const [show, setShow] = useState(false);
  const [previewImage, setPreviewImage] = useState(
    `data:image/jpeg;base64,${props.item.image}`
  );
  const [name, setName] = useState(props.item.name);
  const [description, setDescription] = useState(props.item.description);
  const [difficulty, setDifficulty] = useState(props.item.difficulty);
  const [image, setImage] = useState("");

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
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} size="xl" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Edit Quiz Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3 ">
              <Form.Group as={Col}>
                <Form.Label>Difficulty</Form.Label>
                <Form.Select
                  onChange={(e) => setDifficulty(e.target.value)}
                  defaultValue={difficulty}
                >
                  <option value="EASY">EASY</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HARD">HARD</option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col}></Form.Group>
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
                    <Image src={previewImage} />
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

export default ModalFormUpdateQuiz;
