import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/home', { state: { openModal: 'profile' } });
  }, [navigate]);
  
  return null;
};

export default ProfilePage;