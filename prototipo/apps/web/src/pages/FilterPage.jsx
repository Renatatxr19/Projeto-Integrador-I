import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FilterPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/home', { state: { openModal: 'filter' } });
  }, [navigate]);
  
  return null;
};

export default FilterPage;