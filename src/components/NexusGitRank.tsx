import { Table } from 'antd';
import styles from "../styles/git-rank.module.css";

const campColumns = [
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


const campdata = [
  {
    key: '1',
    s: '5 NEX',
    a: '4 NEX',
    b: '3.5 NEX',
    c: '3 NEX',
  },
];

const NexusGitRank = () => {
  return (
    <div className={styles.tableContainer}>
      <Table
        className={styles.customTable}
        columns={campColumns}
        dataSource={campdata}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default NexusGitRank;
