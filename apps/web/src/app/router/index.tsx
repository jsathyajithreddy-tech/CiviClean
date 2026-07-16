import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "../../components/layout/app-layout";
import { NotFoundPage } from "../../features/shared/not-found-page";
import { appRoutes } from "./route-config";

export function AppRouter(): JSX.Element {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {appRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
