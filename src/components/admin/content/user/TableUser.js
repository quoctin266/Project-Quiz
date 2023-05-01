import Table from "react-bootstrap/Table";
import ModalFormUpdate from "./ModalFormUpdate";
import ModalFormView from "./ModalFormView";
import ModalFormDelete from "./ModalFormDelete";
import ReactPaginate from "react-paginate";
import { useTranslation } from "react-i18next";

const TableUser = (props) => {
  const { listUsers, pageCount, currentPage } = props;
  const { t } = useTranslation();

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{t("admin.manageUser.table.number")}</th>
            <th>{t("admin.manageUser.table.username")}</th>
            <th>{t("admin.manageUser.table.email")}</th>
            <th>{t("admin.manageUser.table.role")}</th>
            <th>{t("admin.manageUser.table.buttonGroup")}</th>
          </tr>
        </thead>
        <tbody>
          {listUsers &&
            listUsers.length > 0 &&
            listUsers.map((item, index) => {
              return (
                <tr key={item.id} style={{ lineHeight: "2.2em" }}>
                  <td>{index + 1}</td>
                  <td>{item.username}</td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  <td>
                    <ModalFormView item={item} />
                    <ModalFormUpdate
                      item={item}
                      getData={props.getData}
                      getDataPaginate={props.getDataPaginate}
                      currentPage={props.currentPage}
                    />
                    <ModalFormDelete
                      item={item}
                      getDataPaginate={props.getDataPaginate}
                      currentPage={props.currentPage}
                    />
                  </td>
                </tr>
              );
            })}
          {listUsers && listUsers.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                {t("admin.manageUser.table.noUser")}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="d-flex justify-content-center mt-5">
        <ReactPaginate
          nextLabel={t("admin.manageUser.paginateNext")}
          onPageChange={props.handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount} //got from API
          previousLabel={t("admin.manageUser.paginatePrev")}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
          forcePage={pageCount !== 0 ? currentPage - 1 : -1} //if there is user data to be fetch, display current page as active
        />
      </div>
    </>
  );
};

export default TableUser;
