import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Alert variant="danger" style={{ textAlign: "center", marginTop: "8%" }}>
      <div style={{ marginTop: "2%" }}>
        <h4>This Page Isn't Available</h4>
        <h5>
          The link may be broken, or the page may have been
          <br /> removed. Check to see if the link you're trying to open is
          <br />
          correct.
        </h5>
      </div>
      <Button
        variant="light my-3"
        onClick={() => {
          navigate("/");
        }}
      >
        Go to HomePage
      </Button>
    </Alert>
  );
};

export default NotFound;
