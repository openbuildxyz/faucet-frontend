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
    s: '1 CAMP',
    a: '0.4 CAMP',
    b: '0.3 CAMP',
    c: '0.1 CAMP',
  },
];

const CampGitRank = () => {
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

export default CampGitRank;
