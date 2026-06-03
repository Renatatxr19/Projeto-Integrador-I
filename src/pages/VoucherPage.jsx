import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VoucherPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/home', { state: { openModal: 'voucher' } });
  }, [navigate]);
  
  return null;
};

export default VoucherPage;