import Table from "react-bootstrap/Table";
import ModalFormUpdateQuiz from "./ModalFormUpdateQuiz";
import ModalFormDeleteQuiz from "./ModalFormDeleteQuiz";

const TableQuiz = (props) => {
  const { listQuiz } = props;

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>No</th>
          <th>Name</th>
          <th>Description</th>
          <th>Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {listQuiz &&
          listQuiz.length > 0 &&
          listQuiz.map((item, index) => {
            return (
              <tr key={item.id} style={{ lineHeight: "2.2em" }}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.difficulty}</td>
                <td style={{ display: "flex", gap: "5%" }}>
                  <ModalFormUpdateQuiz
                    item={item}
                    fetchQuiz={props.fetchQuiz}
                  />
                  <ModalFormDeleteQuiz
                    item={item}
                    fetchQuiz={props.fetchQuiz}
                  />
                </td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
};

export default TableQuiz;
