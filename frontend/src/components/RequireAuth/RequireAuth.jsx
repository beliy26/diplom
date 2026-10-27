import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Обёртка для страниц, куда пускаем только после входа.
// adminOnly - пускать только администратора.
function RequireAuth({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="page">Загрузка...</p>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !user.is_admin) {
    return <p className="page">Доступ только для администратора.</p>;
  }

  return children;
}

export default RequireAuth;
