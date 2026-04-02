import classNames from "classnames/bind";
import styleAccount from "./AdsminAccount.module.scss";
import ContentLayout from "~/Component/ContentLayout";
import ActionMenu from "~/Component/ActionMenu";
import AddAccountModal from "~/Component/AddAccount";
import BaseTable from "~/Component/BaseTable";
import { useEffect, useState } from "react";
import SeeDetailLayout from "~/Component/SeeDetailLayout";

const cls = classNames.bind(styleAccount);

function AdsminAcount() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [openDetail, setOpenDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const [openInactive, setOpenInactive] = useState(false);
  const [activeList, setActiveList] = useState([]);
  const [inactiveList, setInactiveList] = useState([]);

  const [openReset, setOpenReset] = useState(false);
  const [resetList, setResetList] = useState([]);

  // ==================== TOKEN + ROLE ======================
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const authHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (!token || (role !== "Admin" && role !== "Adsmin")) {
      alert("Bạn không có quyền truy cập!");
      window.location.href = "/";
    }
  }, []);

  const columns = [
    { key: "username", title: "Tên đăng nhập" },
    { key: "role", title: "Quyền" },
    { key: "status", title: "Trạng thái" },
  ];

  const columnResets = [
    { key: "username", title: "Tên đăng nhập" },
    { key: "status", title: "Trạng thái" },
  ];

  // ====================== LOAD ACCOUNTS ======================
  const loadData = () => {
    fetch("https://localhost:7287/api/Accounts", {
      headers: authHeader,
    })
      .then((res) => res.json())
      .then((json) => {
        // Sắp xếp theo ngày tạo → tài khoản mới ở trên cùng
        const sorted = [...json].sort(
          (a, b) => new Date(b.dateCreate) - new Date(a.dateCreate)
        );

        setData(sorted);

        const norm = (s) => String(s).trim().toLowerCase();

        setActiveList(sorted.filter((acc) => norm(acc.status) === "active"));
        setInactiveList(
          sorted.filter((acc) => norm(acc.status) === "inactive")
        );
      })
      .catch((err) => console.error("API ERROR:", err));
  };

  // ====================== LOAD RESET TICKETS ======================
  const loadResetTickets = () => {
    fetch("https://localhost:7287/api/ResetTickets", {
      headers: authHeader,
    })
      .then((res) => res.json())
      .then((data) => setResetList(data))
      .catch((err) => console.error("LOAD RESET LIST ERROR:", err));
  };

  useEffect(() => {
    loadData();
    loadResetTickets();
  }, []);

  // ====================== SEARCH FILTER ======================
  const filteredActive = activeList.filter((acc) =>
    acc.username.toLowerCase().includes(search.toLowerCase())
  );

  // ====================== ADD ACCOUNT ======================
  const handleAddAccount = (newAcc) => {
    fetch("https://localhost:7287/api/Accounts", {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify(newAcc),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.text();
          alert(err || "Tên đăng nhập đã tồn tại!");
          throw new Error("Username existed");
        }
        return res.json();
      })
      .then(() => {
        setOpenModal(false);
        alert("Tạo tài khoản mới thành công!");
        loadData();
      })
      .catch((err) => console.error("ADD ACCOUNT ERROR:", err));
  };

  // ====================== LOCK ACCOUNT ======================
  const handleDelete = (row) => {
    if (!window.confirm("Bạn có chắc muốn khóa tài khoản này?")) return;

    fetch(`https://localhost:7287/api/Accounts/lock/${row.accId}`, {
      method: "PUT",
      headers: authHeader,
    })
      .then((res) => res.text())
      .then(() => {
        alert("Đã chuyển tài khoản sang Inactive");
        loadData();
      })
      .catch((err) => console.error("LOCK ERROR:", err));
  };

  // ====================== RESTORE ACCOUNT ======================
  const handleRestore = (row) => {
    if (!window.confirm("Khôi phục tài khoản này?")) return;

    fetch(`https://localhost:7287/api/Accounts/unlock/${row.accId}`, {
      method: "PUT",
      headers: authHeader,
    })
      .then((res) => res.text())
      .then(() => {
        alert("Đã chuyển tài khoản sang Active");
        loadData();
      })
      .catch((err) => console.error("UNLOCK ERROR:", err));
  };

  // ====================== DETAIL ACCOUNT ======================
  const handleDetail = (row) => {
    fetch(`https://localhost:7287/api/Accounts/${row.accId}`, {
      headers: authHeader,
    })
      .then((res) => res.json())
      .then((detail) => {
        setDetailData(detail);
        setOpenDetail(true);
      });
  };

  // ====================== RESET PASSWORD: REJECT ======================
  const handleRefuse = (row) => {
    if (!window.confirm(`Từ chối yêu cầu reset của user ${row.username}?`))
      return;

    fetch(
      `https://localhost:7287/api/Accounts/reset-password/reject/${row.id}`,
      {
        method: "PUT",
        headers: authHeader,
      }
    )
      .then(async (res) => {
        if (!res.ok) {
          alert(await res.text());
          return;
        }

        alert("Đã từ chối yêu cầu đặt lại mật khẩu!");

        setResetList((prev) =>
          prev.map((t) => (t.id === row.id ? { ...t, status: "Rejected" } : t))
        );
      })
      .catch((err) => console.error("REJECT ERROR:", err));
  };

  // ====================== RESET PASSWORD: APPROVE ======================
  const handleReset = (row) => {
    if (!window.confirm(`Duyệt reset mật khẩu cho tài khoản ${row.username}?`))
      return;

    fetch(
      `https://localhost:7287/api/Accounts/reset-password/by-ticket/${row.id}`,
      {
        method: "PUT",
        headers: authHeader,
      }
    )
      .then(async (res) => {
        if (!res.ok) {
          alert(await res.text());
          return;
        }

        alert("Đặt lại mật khẩu thành công!");

        setResetList((prev) =>
          prev.map((t) => (t.id === row.id ? { ...t, status: "Approved" } : t))
        );
      })
      .catch((err) => console.error("RESET ERROR:", err));
  };

  return (
    <ContentLayout>
      <div className="wrapper--btn">
        <button
          className={`${cls("btn--add")} button--add`}
          onClick={() => setOpenModal(true)}
        >
          Thêm tài khoản
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            className="input--search"
            type="text"
            placeholder="Tìm kiếm tài khoản..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <span className={cls("btn--category")}>
            ☰
            <ul className={cls("category--list")}>
              <li
                className={cls("category--item")}
                onClick={() => setOpenInactive(true)}
              >
                Inactive
              </li>
              <li
                className={cls("category--item")}
                onClick={() => setOpenReset(true)}
              >
                Reset
              </li>
            </ul>
          </span>
        </div>
      </div>

      {/* ACTIVE LIST */}
      <div className={cls("wrapper--table")}>
        <h2 className={cls("table--head")}>Tài khoản đang hoạt động</h2>
        <BaseTable
          columns={columns}
          data={filteredActive}
          renderAction={(row) => (
            <ActionMenu
              onDelete={() => handleDelete(row)}
              onDetail={() => handleDetail(row)}
            />
          )}
        />
      </div>

      {/* INACTIVE LIST */}
      <SeeDetailLayout
        title="Tài khoản không hoạt động"
        open={openInactive}
        onClose={() => setOpenInactive(false)}
      >
        <BaseTable
          columns={columns}
          data={inactiveList}
          renderAction={(row) => (
            <button
              className={cls("btn--restore")}
              onClick={() => handleRestore(row)}
            >
              Active
            </button>
          )}
        />
      </SeeDetailLayout>

      {/* RESET TICKET LIST */}
      <SeeDetailLayout
        title="Tài khoản cần đặt lại mật khẩu"
        open={openReset}
        onClose={() => setOpenReset(false)}
      >
        <BaseTable
          columns={columnResets}
          data={resetList}
          renderAction={(row) => {
            if (row.status === "Rejected")
              return <span className="btn--close disabled">Từ chối duyệt</span>;

            if (row.status === "Approved")
              return <span className="btn--submit disabled">Đã duyệt</span>;

            return (
              <>
                <button
                  className="btn--close"
                  onClick={() => handleRefuse(row)}
                >
                  Refuse
                </button>
                <button
                  className="btn--submit"
                  onClick={() => handleReset(row)}
                >
                  Reset
                </button>
              </>
            );
          }}
        />
      </SeeDetailLayout>

      {/* ACCOUNT DETAIL */}
      {openDetail && detailData && (
        <SeeDetailLayout
          title="Tài khoản"
          open={openDetail}
          onClose={() => setOpenDetail(false)}
        >
          <p className="label--detail">
            <strong>ID:</strong> {detailData.accId}
          </p>
          <p className="label--detail">
            <strong>Tên đăng nhập:</strong> {detailData.username}
          </p>
          <p className="label--detail">
            <strong>Quyền:</strong> {detailData.role}
          </p>
          <p className="label--detail">
            <strong>Trạng thái:</strong> {detailData.status}
          </p>
          <p className="label--detail">
            <strong>Ngày tạo:</strong> {detailData.dateCreate}
          </p>
        </SeeDetailLayout>
      )}

      <AddAccountModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleAddAccount}
      />
    </ContentLayout>
  );
}

export default AdsminAcount;
