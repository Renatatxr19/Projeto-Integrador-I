import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ValidationPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/home', { state: { openModal: 'scanner' } });
  }, [navigate]);
  
  return null;
};

export default ValidationPage;