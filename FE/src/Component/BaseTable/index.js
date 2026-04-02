import classNames from "classnames/bind";
import styleBaseTable from "./BaseTable.module.scss";
import ActionMenu from "../ActionMenu";

const cls = classNames.bind(styleBaseTable);

function BaseTable({
  columns = [],
  data = [],
  renderAction,
  height = "550px",
}) {
  return (
    <div
      className={cls("wrapper")}
      style={{ height: height, overflowY: "auto" }} // áp dụng height vào wrapper
    >
      <table className={cls("table")}>
        <thead>
          <tr>
            <th>STT</th>
            {columns.map((col) => (
              <th key={col.key}>{col.title}</th>
            ))}
            {renderAction && <th></th>}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className={cls("table--row")}>
              <td>{rowIndex + 1}</td>

              {columns.map((col) => (
                <td key={col.key}>{row[col.key]}</td>
              ))}

              {renderAction && <td>{renderAction(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BaseTable;
