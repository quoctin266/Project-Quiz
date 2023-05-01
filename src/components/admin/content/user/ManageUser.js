import ModalFormCreate from "./ModalFormCreate";
import "./ManageUser.scss";
import TableUser from "./TableUser";
import { useEffect, useState } from "react";
import { getUserPaginate } from "../../../../services/APIService";
import { useTranslation } from "react-i18next";

const ManageUser = () => {
  const [listUsers, setListUsers] = useState([]);
  const [pageCount, setPageCount] = useState(0); //don't display paginate if there's no user
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();

  const LIMIT_USER = 8; //max user per page

  const handlePageClick = (event) => {
    getDataPaginate(+event.selected + 1); //event.selected count from 0
    setCurrentPage(+event.selected + 1);
  };

  let getDataPaginate = async (page) => {
    let data = await getUserPaginate(page, LIMIT_USER);
    if (data?.DT?.users?.length > 0) {
      setListUsers(data.DT.users);
      setPageCount(data.DT.totalPages);
    }
    //In case of re-fetch after deleting all user in one page
    if (data?.DT?.users?.length === 0) {
      setPageCount(data.DT.totalPages);

      if (page > 1) {
        let dataNew = await getUserPaginate(page - 1, LIMIT_USER); // re-fetch and display all user of the previous page if current page is not the only page left
        setListUsers(dataNew.DT.users);
        setCurrentPage(page - 1);
      } else {
        setListUsers([]); //all user deleted and no page left
        setCurrentPage(1);
      }
    }
  };

  useEffect(() => {
    getDataPaginate(1);
  }, []);

  return (
    <div className="manage-user-container">
      <div className="title">{t("admin.manageUser.title")}</div>
      <div className="user-content">
        <div className="btn-add-new">
          <ModalFormCreate
            getDataPaginate={getDataPaginate}
            currentPage={currentPage}
          />
        </div>
        <div className="users-table">
          <TableUser
            listUsers={listUsers}
            handlePageClick={handlePageClick}
            pageCount={pageCount}
            currentPage={currentPage}
            getDataPaginate={getDataPaginate}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
