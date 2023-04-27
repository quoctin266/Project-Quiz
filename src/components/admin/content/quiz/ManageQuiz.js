import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import "./ManageQuiz.scss";
import Select from "react-select";
import { useState, useEffect } from "react";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import {
  postCreateQuiz,
  getAllQuizAdmin,
} from "../../../../services/APIService";
import { toast } from "react-toastify";
import TableQuiz from "./TableQuiz";
import Accordion from "react-bootstrap/Accordion";
import QuizQA from "./QuizQA";
import AssignQuiz from "./AssignQuiz";

const ManageQuiz = () => {
  const [previewImage, setPreviewImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(null);
  const [image, setImage] = useState("");
  const [listQuiz, setListQuiz] = useState([]);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    let data = await getAllQuizAdmin();
    if (data?.DT) {
      setListQuiz(data.DT);
    }
  };

  const options = [
    { value: "EASY", label: "EASY" },
    { value: "MEDIUM", label: "MEDIUM" },
    { value: "HARD", label: "HARD" },
  ];

  const handleOnchangeImage = (e) => {
    if (e.target.files.length > 0) {
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
    }
  };

  const handleSaveQuiz = async () => {
    if (!name || !description || !type || !image) {
      toast.error("Missing one or more fields!");
      return;
    }

    let data = await postCreateQuiz(name, description, type.value, image);
    if (data?.DT) {
      toast.success(data.EM);

      setPreviewImage("");
      setName("");
      setDescription("");
      setType({});
      setImage(""); //if submit success, reset all state
      document.getElementById("file-input").value = null; //clear file input field after submitting

      fetchQuiz(); //re-fetch data after add new quiz
    } else toast.error(data.EM);
  };

  return (
    <div className="quiz-container">
      <div className="quiz-title">Manage Quiz</div>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div style={{ fontSize: "1.3em" }}>Add New Quiz</div>
          </Accordion.Header>
          <Accordion.Body>
            <div className="add-new">
              <fieldset className="border p-2" style={{ borderRadius: "5px" }}>
                <legend className="float-none w-auto p-2">Quiz info</legend>
                <div className="px-3">
                  <FloatingLabel
                    controlId="floatingName"
                    label="Name"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Quiz name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FloatingLabel>

                  <FloatingLabel
                    controlId="floatingDescription"
                    label="Description"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Quiz description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </FloatingLabel>

                  <Select
                    defaultValue={type}
                    value={type}
                    onChange={setType}
                    options={options}
                    placeholder="Quiz type..."
                    className="my-3"
                  />

                  <Form.Group>
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) => handleOnchangeImage(e)}
                      id="file-input"
                    />
                    <div className="quiz-image-preview mt-3">
                      {previewImage ? (
                        <Image src={previewImage} />
                      ) : (
                        <span style={{ color: "rgb(180, 177, 177)" }}>
                          Preview Image
                        </span>
                      )}
                    </div>
                  </Form.Group>
                  <div className="my-3" style={{ textAlign: "right" }}>
                    <Button variant="primary" onClick={handleSaveQuiz}>
                      Save
                    </Button>
                  </div>
                </div>
              </fieldset>
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <div style={{ fontSize: "1.3em" }}>Update Quiz QA</div>
          </Accordion.Header>
          <Accordion.Body>
            <QuizQA />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>
            <div style={{ fontSize: "1.3em" }}>Assign Quiz to User</div>
          </Accordion.Header>
          <Accordion.Body>
            <AssignQuiz listQuiz={listQuiz} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="list-detail">
        <div className="table-title">Quiz List</div>
        <TableQuiz listQuiz={listQuiz} fetchQuiz={fetchQuiz} />
      </div>
    </div>
  );
};

export default ManageQuiz;
