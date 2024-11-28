import {
  Box,
  Pagination as MuiPagination,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { PaginationProps } from '../types/pagination-types';

const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentPage, totalPages, totalUsers, pageSize } = pagination;

  const startRange = (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, totalUsers);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <Box
      sx={{
        mt: 3,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ order: { xs: 2, sm: 1 } }}
      >
        Showing {startRange}-{endRange} of {totalUsers} users
      </Typography>

      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        size={isMobile ? 'small' : 'medium'}
        sx={{
          order: { xs: 1, sm: 2 },
          '& .MuiPagination-ul': {
            justifyContent: 'center',
          },
          '& .Mui-selected': {
            pointerEvents: 'none',
          },
        }}
      />
    </Box>
  );
};

export default Pagination;
