import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { deleteUser } from "../../../../services/APIService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ModalFormDelete = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { t } = useTranslation();

  const handleSubmitDelete = async () => {
    let data = await deleteUser(props.item.id);
    if (data && data.EC === 0) {
      toast.success("Deleted successfully!");
      await props.getDataPaginate(props.currentPage); //re-fetching listuser after deleting a user
    } else {
      if (data?.DT.id === 1) toast.error("This account can not be deleted.");
      else toast.error(data.EM);
    }
    handleClose();
  };

  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        {t("admin.manageUser.formDelete.openButton")}
      </Button>

      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{t("admin.manageUser.formDelete.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t("admin.manageUser.formDelete.confirmMessage")}
          <br />
          Email: <b>{props.item.email}</b>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("admin.manageUser.formDelete.cancelButton")}
          </Button>
          <Button variant="primary" onClick={handleSubmitDelete}>
            {t("admin.manageUser.formDelete.confirmButton")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalFormDelete;
