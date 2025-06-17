'use client';
import { useSessionCheck } from '@/hooks/useSessionCheck';
import SignUpForm from './components/SignUpForm';

const Signup = () => {
    useSessionCheck(); // 클라이언트 훅 호출
    return <SignUpForm />;
};

export default Signup;
