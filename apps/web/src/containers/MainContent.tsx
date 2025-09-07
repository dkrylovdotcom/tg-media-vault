import { CssBaseline, Container } from '@mui/material';
import { RouteObject, useRoutes } from 'react-router-dom';
import { AppTheme } from '../providers/AppTheme';
import { ErrorBoundary } from 'react-error-boundary';
import { FallbackPage } from '../pages/error/FallbackPage';

interface Props {
  routesList: RouteObject[];
}

export const MainContent = (props: Props) => {
  const { routesList } = props;
  const Page = useRoutes(routesList);

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />

      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 4, gap: 4 }}
      >
        <ErrorBoundary FallbackComponent={FallbackPage}>{Page}</ErrorBoundary>
      </Container>
    </AppTheme>
  );
}
