import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import "./Profile.scss";
import {
  postUpdateProfile,
  postChangePassword,
  getHistory,
} from "../../services/APIService";
import { userUpdateProfile } from "../../redux/action/userAction";
import { toast } from "react-toastify";
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";
import _ from "lodash";
import moment from "moment";
import Table from "react-bootstrap/Table";
import { Scrollbars } from "react-custom-scrollbars-2";

const Profile = (props) => {
  const { showModal, setShowModal } = props;

  const account = useSelector((state) => state.userAccount.account);
  const isAuthenticated = useSelector(
    (state) => state.userAccount.isAuthenticated
  );
  if (account.image && !account.image.includes(`data:image`)) {
    account.image = `data:image/jpeg;base64,${account.image}`;
  }

  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [currentPasswordType, setCurrentPasswordType] = useState("password");
  const [newPasswordType, setNewPasswordType] = useState("password");
  const [confirmNewPasswordType, setConfirmNewPasswordType] =
    useState("password");

  const [historyList, setHistoryList] = useState([]);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  // refetch data from redux after update
  useEffect(() => {
    setUsername(account.username);
    setPreviewImage(account.image);
  }, [account]);

  // fetch history list on load
  useEffect(() => {
    const fetchHistory = async () => {
      let res = await getHistory();
      if (res?.DT?.data && res.EC === 0) {
        let dataHistory = _.cloneDeep(res.DT.data);
        dataHistory = dataHistory.map((item) => {
          return {
            attempId: item.id,
            quizName: item.quizHistory.name,
            totalQuestions: item.total_questions,
            correctAnswers: item.total_correct,
            submitTime: moment(item.createdAt)
              .utc()
              .format("YYYY-MM-DD hh:mm:ss a"),
          };
        });
        setHistoryList(dataHistory);
      }
    };
    if (isAuthenticated) {
      fetchHistory();
    }
  }, [isAuthenticated]);

  // toogle show/hide password base on input type
  const togglePassword = (passwordInput) => {
    switch (passwordInput) {
      case "current":
        if (currentPasswordType === "password") {
          setCurrentPasswordType("text");
          return;
        }
        setCurrentPasswordType("password");
        break;
      case "new":
        if (newPasswordType === "password") {
          setNewPasswordType("text");
          return;
        }
        setNewPasswordType("password");
        break;
      case "confirmNew":
        if (confirmNewPasswordType === "password") {
          setConfirmNewPasswordType("text");
          return;
        }
        setConfirmNewPasswordType("password");
        break;
      default:
        return;
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleOnchangeImage = (e) => {
    if (e.target.files.length > 0) {
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
    }
  };

  // reset fields and close
  const handleClose = () => {
    setUsername(account.username);
    setImage("");
    setPreviewImage(account.image);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowModal(false);
  };

  const handleUpdatePersonalInfo = async () => {
    if (!username) {
      toast.error("Missing field(s)!");
      return;
    }

    let reduxImage = "";
    if (image) {
      reduxImage = await toBase64(image);
    }

    dispatch(
      userUpdateProfile({
        username: username,
        image: reduxImage ? reduxImage : account.image, // if user choose new image then send it to redux otherwise keep the current image
      })
    );

    let data = await postUpdateProfile(username, image);
    if (data && data.EC === 0) {
      toast.success("Update profile successfully.");
      // reset all tabs field before closing
      setImage("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowModal(false);
    } else toast.error("Something went wrong.");
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Missing field(s)!");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Confirmation password does not match new password!");
      return;
    }

    let data = await postChangePassword(currentPassword, newPassword);
    if (data && data.EC === 0) {
      toast.success("Update password successfully.");
      // reset all tabs field before closing
      handleClose();
    } else toast.error("Incorrect password!");
  };

  return (
    <Modal
      size="xl"
      show={showModal}
      onHide={() => setShowModal(false)}
      aria-labelledby="modal-title"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title id="modal-title">{t("header.profile.title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ minHeight: "335px" }}>
        <Tabs
          defaultActiveKey="personalInfo"
          id="fill-tab"
          className="mb-3"
          fill
          unmountOnExit={true}
        >
          {/* Personal info tab */}
          <Tab eventKey="personalInfo" title={t("header.profile.tab1")}>
            <Form>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={account.email} disabled />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>{t("header.profile.roleLabel")}</Form.Label>
                  <Form.Control value={account.role} disabled />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>{t("header.profile.usernameLabel")}</Form.Label>
                  <Form.Control
                    value={username}
                    type="text"
                    placeholder={t("header.profile.usernamePlaceholder")}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>
                <Form.Group as={Col}></Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group>
                  <Form.Label>{t("header.profile.imageLabel")}</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => handleOnchangeImage(e)}
                  />
                  <div className="image-preview mt-3">
                    {previewImage ? (
                      <Image src={previewImage} style={{ height: "20vh" }} />
                    ) : (
                      <span style={{ color: "rgb(180, 177, 177)" }}>
                        {t("header.profile.previewImage")}
                      </span>
                    )}
                  </div>
                </Form.Group>
              </Row>
              <div className="button-group">
                <Button variant="secondary" onClick={handleClose}>
                  {t("header.profile.closeButton")}
                </Button>
                <Button
                  className="save-btn"
                  variant="primary"
                  onClick={handleUpdatePersonalInfo}
                >
                  {t("header.profile.saveButton")}
                </Button>
              </div>
            </Form>
          </Tab>

          {/* Change password tab */}
          <Tab eventKey="changePassword" title={t("header.profile.tab2")}>
            <Form.Group
              className="current-password"
              controlId="formCurrentPassword"
            >
              <Form.Label>{t("header.profile.currentPassword")}</Form.Label>
              <div className="password-container">
                <Form.Control
                  type={currentPasswordType}
                  placeholder={t("header.profile.currentPasswordPlaceholder")}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <span
                  className="password-toogle"
                  onClick={() => togglePassword("current")}
                >
                  {currentPasswordType === "password" ? <BiShow /> : <BiHide />}
                </span>
              </div>
            </Form.Group>

            <Form.Group className="new-password" controlId="formNewPassword">
              <Form.Label>{t("header.profile.newPassword")}</Form.Label>
              <div className="password-container">
                <Form.Control
                  type={newPasswordType}
                  placeholder={t("header.profile.newPasswordPlaceholder")}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span
                  className="password-toogle"
                  onClick={() => togglePassword("new")}
                >
                  {newPasswordType === "password" ? <BiShow /> : <BiHide />}
                </span>
              </div>
            </Form.Group>

            <Form.Group
              className="confirm-new-password"
              controlId="formConfirmNewPassword"
            >
              <Form.Label>{t("header.profile.confirmNewPassword")}</Form.Label>
              <div className="password-container">
                <Form.Control
                  type={confirmNewPasswordType}
                  placeholder={t(
                    "header.profile.confirmNewPasswordPlaceholder"
                  )}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
                <span
                  className="password-toogle"
                  onClick={() => togglePassword("confirmNew")}
                >
                  {confirmNewPasswordType === "password" ? (
                    <BiShow />
                  ) : (
                    <BiHide />
                  )}
                </span>
              </div>
            </Form.Group>

            <div className="button-group">
              <Button variant="secondary" onClick={handleClose}>
                {t("header.profile.closeButton")}
              </Button>
              <Button
                className="save-btn"
                variant="primary"
                onClick={handleUpdatePassword}
              >
                {t("header.profile.confirmButton")}
              </Button>
            </div>
          </Tab>

          {/* History tab */}
          <Tab eventKey="history" title={t("header.profile.tab3")}>
            <div className="history-title">
              {" "}
              {t("header.profile.listTitle")}{" "}
            </div>
            <div className="history-list">
              <Scrollbars
                style={{ height: "50vh" }}
                autoHide
                // Hide delay in ms
                autoHideTimeout={1000}
                // Duration for hide animation in ms.
                autoHideDuration={200}
              >
                <Table striped bordered hover>
                  <thead className="table-header">
                    <tr>
                      <th>{t("header.profile.quizName")}</th>
                      <th>{t("header.profile.countQuestion")}</th>
                      <th>{t("header.profile.countCorrect")}</th>
                      <th>{t("header.profile.submitTime")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyList &&
                      historyList.length > 0 &&
                      historyList.map((attemp) => {
                        return (
                          <tr key={attemp.attempId}>
                            <td> {attemp.quizName} </td>
                            <td>{attemp.totalQuestions}</td>
                            <td>{attemp.correctAnswers}</td>
                            <td>{attemp.submitTime}</td>
                          </tr>
                        );
                      })}
                    {historyList && historyList.length === 0 && (
                      <tr style={{ lineHeight: "70px" }}>
                        <td colSpan={4}>{t("header.profile.emptyList")}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Scrollbars>
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default Profile;
