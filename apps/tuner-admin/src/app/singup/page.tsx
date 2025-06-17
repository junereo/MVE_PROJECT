'use client';
import { useSessionCheck } from '@/hooks/useSessionCheck';
import SingUpForm from './components/SingUpForm';

const Signup = () => {
    useSessionCheck(); // 클라이언트 훅 호출
    return <SingUpForm />;
};

export default Signup;
