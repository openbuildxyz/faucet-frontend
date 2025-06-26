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
    s: '1 MON',
    a: '0.4 MON',
    b: '0.3 MON',
    c: '0.1 MON',
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
