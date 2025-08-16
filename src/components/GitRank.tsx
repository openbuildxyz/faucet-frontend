import { Table } from 'antd';
import styles from "../styles/git-rank.module.css";

const columns = [
  {
    title: 'S',
    dataIndex: 's',
    key: 's',
  },
  {
    title: 'A+, A, A-',
    dataIndex: 'a',
    key: 'a',
  },
  {
    title: 'B+, B, B-',
    dataIndex: 'b',
    key: 'b',
  },
  {
    title: 'C+, C',
    dataIndex: 'c',
    key: 'c',
  },
];

const data = [
  {
    key: '1',
    s: '5 MON',
    a: '4 MON',
    b: '3.5 MON',
    c: '3 MON',
  },
];

const GitRank = () => {
  return (
    <div className={styles.tableContainer}>
      <Table
        className={styles.customTable}
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default GitRank;
