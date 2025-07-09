"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const baseUrl = "http://localhost:4000";

// 컨트랙트 주소 검증 함수
const validateContractAddress = (address: string): boolean => {
  if (!address) return true; // 빈 값은 검증 통과 (저장 시에만 체크)
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// ABI JSON 형식 검증 함수
const validateAbiFormat = (abi: string): boolean => {
  if (!abi.trim()) return true; // 빈 값은 검증 통과 (저장 시에만 체크)
  const trimmedAbi = abi.trim();
  return trimmedAbi.startsWith('[') || trimmedAbi.startsWith('{');
};

export default function ContractManager() {
  const [caToken, setCaToken] = useState("");
  const [caBadge, setCaBadge] = useState("");
  const [caSurvey, setCaSurvey] = useState("");
  const [caTransac, setCaTransac] = useState("");
  const [abiSurvey, setAbiSurvey] = useState("");
  const [abiBadge, setAbiBadge] = useState("");
  const [abiTransac, setAbiTransac] = useState("");

  // 에러 상태 관리
  const [errors, setErrors] = useState({
    caToken: false,
    caBadge: false,
    caSurvey: false,
    caTransac: false,
    abiSurvey: false,
    abiBadge: false,
    abiTransac: false,
  });

  // 입력값 변경 시 검증
  const handleAddressChange = (field: keyof typeof errors, value: string) => {
    const isValid = validateContractAddress(value);
    setErrors(prev => ({ ...prev, [field]: !isValid }));
    
    // 해당 필드의 setter 함수 호출
    switch (field) {
      case 'caToken':
        setCaToken(value);
        break;
      case 'caBadge':
        setCaBadge(value);
        break;
      case 'caSurvey':
        setCaSurvey(value);
        break;
      case 'caTransac':
        setCaTransac(value);
        break;
    }
  };

  // ABI 입력값 변경 시 검증
  const handleAbiChange = (field: 'abiSurvey' | 'abiBadge' | 'abiTransac', value: string) => {
    const isValid = validateAbiFormat(value);
    setErrors(prev => ({ ...prev, [field]: !isValid }));
    
    // 해당 필드의 setter 함수 호출
    if (field === 'abiSurvey') {
      setAbiSurvey(value);
    } else if (field === 'abiBadge') {
      setAbiBadge(value);
    } else {
      setAbiTransac(value);
    }
  };

  const fetchContract = async () => {
    try {
      const res = await axios.get(baseUrl + "/contract/ca");
      const data = res.data?.result || res.data?.data || res.data;
      setCaToken(data.ca_token || "");
      setCaBadge(data.ca_badge || "");
      setCaSurvey(data.ca_survey || "");
      setCaTransac(data.ca_transac || "");
      setAbiSurvey(data.abi_survey ? JSON.stringify(data.abi_survey, null, 2) : "");
      setAbiBadge(data.abi_badge ? JSON.stringify(data.abi_badge, null, 2) : "");
      setAbiTransac(data.abi_transac ? JSON.stringify(data.abi_transac, null, 2) : "");
      
      // 초기 로드 시 에러 상태 초기화
      setErrors({
        caToken: false,
        caBadge: false,
        caSurvey: false,
        caTransac: false,
        abiSurvey: false,
        abiBadge: false,
        abiTransac: false,
      });
    } catch (e) {
      toast.error("컨트랙트 정보를 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    fetchContract();
  }, []);

  const handleContractSave = async () => {
    if (!caToken || !caBadge || !caSurvey || !caTransac || !abiSurvey || !abiBadge || !abiTransac) {
      let emptyFields = [];
      if (!caToken) emptyFields.push("Token Address");
      if (!caBadge) emptyFields.push("Badge Address");
      if (!caSurvey) emptyFields.push("Survey Address");
      if (!caTransac) emptyFields.push("Transac Address");
      if (!abiSurvey) emptyFields.push("Survey ABI");
      if (!abiBadge) emptyFields.push("Badge ABI");
      if (!abiTransac) emptyFields.push("Transac ABI");
      alert(`빈 값: ${emptyFields.join(", ")}`);
      return;
    }

    // 저장 전 최종 검증
    const hasErrors = Object.values(errors).some(error => error);
    if (hasErrors) {
      // 어떤 필드에서 에러가 발생했는지 확인
      const errorFields = [];
      if (errors.caToken) errorFields.push("토큰 컨트랙트");
      if (errors.caBadge) errorFields.push("뱃지 컨트랙트");
      if (errors.caSurvey) errorFields.push("서베이 컨트랙트");
      if (errors.caTransac) errorFields.push("메타 트랜잭션 컨트랙트");
      if (errors.abiSurvey) errorFields.push("Survey ABI");
      if (errors.abiBadge) errorFields.push("Badge ABI");
      if (errors.abiTransac) errorFields.push("Transac ABI");
      
      alert(`입력 형식이 올바르지 않습니다.\n\n문제가 있는 필드:\n${errorFields.join("\n")}\n\n컨트랙트 주소: 0x로 시작하고 총 42자여야 합니다.\nABI: [ 또는 { 로 시작해야 합니다.`);
      return;
    }

    try {
      await axios.post(baseUrl + "/contract/ca", {
        ca_token: caToken,
        ca_badge: caBadge,
        ca_survey: caSurvey,
        ca_transac: caTransac,
        abi_survey: JSON.parse(abiSurvey),
        abi_badge: JSON.parse(abiBadge),
        abi_transac: JSON.parse(abiTransac),
      });
      toast.success("컨트랙트 정보가 저장되었습니다.");
      fetchContract();
    } catch (e) {
      toast.error("저장 실패");
    }
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold text-blue-700 mb-2">컨트랙트 정보 관리</h2>
      
      <div>
        <label className="font-semibold">토큰 컨트랙트 :</label>
        <Input 
          placeholder="Token Address" 
          value={caToken} 
          onChange={e => handleAddressChange('caToken', e.target.value)}
          className={errors.caToken ? "border-red-500" : ""}
        />
        {errors.caToken && (
          <p className="text-red-500 text-sm mt-1">형식이 맞지 않습니다</p>
        )}
      </div>

      <div>
        <label className="font-semibold">뱃지 컨트랙트 :</label>
        <Input 
          placeholder="Badge Address" 
          value={caBadge} 
          onChange={e => handleAddressChange('caBadge', e.target.value)}
          className={errors.caBadge ? "border-red-500" : ""}
        />
        {errors.caBadge && (
          <p className="text-red-500 text-sm mt-1">형식이 맞지 않습니다</p>
        )}
      </div>

      <div>
        <label className="font-semibold">서베이 컨트랙트 :</label>
        <Input 
          placeholder="Survey Address" 
          value={caSurvey} 
          onChange={e => handleAddressChange('caSurvey', e.target.value)}
          className={errors.caSurvey ? "border-red-500" : ""}
        />
        {errors.caSurvey && (
          <p className="text-red-500 text-sm mt-1">형식이 맞지 않습니다</p>
        )}
      </div>

      <div>
        <label className="font-semibold">메타 트랜잭션 컨트랙트 :</label>
        <Input 
          placeholder="Transac Address" 
          value={caTransac} 
          onChange={e => handleAddressChange('caTransac', e.target.value)}
          className={errors.caTransac ? "border-red-500" : ""}
        />
        {errors.caTransac && (
          <p className="text-red-500 text-sm mt-1">형식이 맞지 않습니다</p>
        )}
      </div>

      <div>
        <label className="font-semibold">Survey ABI (JSON)</label>
        <textarea
          className={`border rounded p-2 w-full font-mono ${errors.abiSurvey ? "border-red-500" : ""}`}
          rows={4}
          placeholder="Survey ABI (JSON)"
          value={abiSurvey}
          onChange={e => handleAbiChange('abiSurvey', e.target.value)}
        />
        {errors.abiSurvey && (
          <p className="text-red-500 text-sm mt-1">형식이 맞지 않습니다</p>
        )}
      </div>
      
      <div>
        <label className="font-semibold">Badge ABI (JSON)</label>
        <textarea
          className={`border rounded p-2 w-full font-mono ${errors.abiBadge ? "border-red-500" : ""}`}
          rows={4}
          placeholder="Badge ABI (JSON)"
          value={abiBadge}
          onChange={e => handleAbiChange('abiBadge', e.target.value)}
        />
        {errors.abiBadge && (
          <p className="text-red-500 text-sm mt-1">형식이 맞지 않습니다</p>
        )}
      </div>

      <div>
        <label className="font-semibold">Transac ABI (JSON)</label>
        <textarea
          className={`border rounded p-2 w-full font-mono ${errors.abiTransac ? "border-red-500" : ""}`}
          rows={4}
          placeholder="Transac ABI (JSON)"
          value={abiTransac}
          onChange={e => handleAbiChange('abiTransac', e.target.value)}
        />
        {errors.abiTransac && (
          <p className="text-red-500 text-sm mt-1">형식이 맞지 않습니다</p>
        )}
      </div>
      <button className="w-full bg-blue-600 text-white py-2 rounded" onClick={handleContractSave}>
        변경
      </button>
    </div>
  );
} 