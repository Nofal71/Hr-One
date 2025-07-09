import * as React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Text } from '@fluentui/react-components';
import { UserFields } from './types';
import { useStyles } from './styles';

interface UserStatusTableProps {
  userFields: UserFields | null;
  userName: string | undefined;
}

const UserStatusTable: React.FC<UserStatusTableProps> = ({ userFields, userName }) => {
  const styles = useStyles();

  if (!userFields || !userFields.Clockin) {
    return <div className={styles.tableContainer}><Text>No attendance data available</Text></div>;
  }

  return (
    <div className={styles.tableContainer}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell className={styles.tableHeaderCell}>Name</TableHeaderCell>
            <TableHeaderCell className={styles.tableHeaderCell}>Status</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className={styles.tableCell}>{userName || '—'}</TableCell>
            <TableCell className={styles.tableCell}>Present</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default UserStatusTable;