import { Table } from 'antd';
import styles from "../styles/git-rank.module.css";

const zeroGColumns = [
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


const zeroGdata = [
  {
    key: '1',
    s: '0.5 0G',
    a: '0.3 0G',
    b: '0.1 0G',
  },
];

const ZeroGGitRank = () => {
  return (
    <div className={styles.tableContainer}>
      <Table
        className={styles.customTable}
        columns={zeroGColumns}
        dataSource={zeroGdata}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default ZeroGGitRank;
