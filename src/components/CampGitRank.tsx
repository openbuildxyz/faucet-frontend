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
];


const campdata = [
  {
    key: '1',
    s: '0.5 CAMP',
    a: '0.3 CAMP',
    b: '0.1 CAMP',
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
