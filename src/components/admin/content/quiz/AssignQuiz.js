import { useState, useEffect } from "react";
import Select from "react-select";
import { getAllUser, postAssignQuiz } from "../../../../services/APIService";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import "./AssignQuiz.scss";
import { toast } from "react-toastify";

const AssignQuiz = (props) => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [listUser, setListUser] = useState([]);
  const { listQuiz } = props;

  let newListQuiz = listQuiz.map((quiz) => {
    return {
      value: quiz.id,
      label: `${quiz.id} - ${quiz.name}`,
    };
  });

  useEffect(() => {
    fetchUser();
  }, []); // get all quiz and users available when page load

  const fetchUser = async () => {
    let data = await getAllUser();
    if (data?.DT) {
      let newListUser = data.DT.map((user) => {
        return {
          value: user.id,
          label: `${user.id} - ${user.username} - ${user.email}`,
        };
      });
      setListUser(newListUser);
    }
  };

  const handleAssign = async () => {
    let data = await postAssignQuiz(selectedQuiz.value, selectedUser.value);
    if (data && data.EC === 0) {
      toast.success(data.EM);
    } else toast.error(data.EM);
  };

  return (
    <div className="assign-quiz-container">
      <div className="select-container">
        <Row>
          <Form.Group as={Col}>
            <div className="select-quiz">
              <div className="select-quiz-header">Select Quiz:</div>
              <Select
                defaultValue={selectedQuiz}
                value={selectedQuiz}
                onChange={setSelectedQuiz}
                options={newListQuiz}
                placeholder="Select..."
                className="mt-2"
              />
            </div>
          </Form.Group>

          <Form.Group as={Col}>
            <div className="select-user">
              <div className="select-user-header">Select User:</div>
              <Select
                defaultValue={selectedUser}
                value={selectedUser}
                onChange={setSelectedUser}
                options={listUser}
                placeholder="Select..."
                className="mt-2"
              />
            </div>
          </Form.Group>
        </Row>
        <div className="save-btn">
          <Button variant="primary" onClick={() => handleAssign()}>
            Assign
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignQuiz;
