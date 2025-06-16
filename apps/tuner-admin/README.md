# 전체 프로세스 개요 (2025.06.13 기준)

### 목표

* **회원가입(Signup)**과 **로그인(Signin)** 기능을 단계별로 구현하고
* 로그인 이후 사용자 정보를 **전역 상태(Zustand)** 및 **쿠키**에 저장하여 인증 유지

## 1. 회원가입(Signup) 프로세스

### 정의

* **회원**: 사이트 내 상호작용 권한을 가진 사용자
* **회원가입**: 사용자가 정보를 제출하여 **권한을 부여받는 과정**

### 데이터 흐름

```
사용자 입력 (프론트)
     ↓
서버로 전송 (백엔드)
     ↓
DB에 저장
     ↓
결과 반환 (성공/실패)
     ↓
전역 상태 저장 (Zustand)
     ↓
쿠키 저장 (선택적으로 HttpOnly 포함)
```

### 저장 목적

* 브라우저 측에 저장된 정보는 **화면 조건부 렌더링**, **API 호출 시 인증** 등에 사용됨.

## 2. Zustand + React Query에 대한 의견

### ✅ 혜성님 의견

* **React Query + Zustand 병행 사용**은 상태 관리 및 캐싱 효율화를 위한 시도
* 실험 및 학습 차원에서 접근한 것

### ⚠ 교강사 의견

* **회원가입은 단순히 상태 저장만으로 충분**
* React Query는 주로 **데이터 패칭/캐싱에 최적화**되므로, 목적에 맞게 사용해야 함
* 공부 목적이라면 메인 페이지 등 적합한 위치에서 사용했어야 함

## 3. 상태 저장 확인

* Zustand에 저장된 값이 실제로 잘 들어갔는지 **확인하지 않은 상태**
* → 확인 방법: Zustand store에서 상태값 console.log 또는 Devtools 확인

## 4. 관리자 회원가입 플로우

### 🎯 목표

* 슈퍼 관리자가 새로운 관리자를 **직접 가입**시켜주는 방식

### 🔄 흐름

1. **슈퍼 관리자 로그인**
2. 신입 관리자에게 이메일 & 비번 요청
3. 슈퍼 관리자가 관리자 회원가입 페이지로 이동
4. 신입 정보 입력 → 회원가입 진행
5. DB 저장 확인
6. 정상 저장 확인 후, 신입에게 정보 전달
7. 신입은 로그인 페이지로 이동해 로그인
8. 관리자 대시보드 진입

## 5. 학생 질문에 대한 해설

> "왜 로그인 페이지로 가야 하죠? 관리자 페이지에서 가입된 계정이면 로그인된 상태 아닌가요?"

* **답변**:

  * 회원가입은 단순히 "DB에 정보 추가"일 뿐
  * "로그인"은 해당 계정 정보가 **실제 유효한지 인증**받고, 그 결과로 **세션 or 토큰 발급**을 받는 과정
  * 따라서, 반드시 **로그인 페이지에서 인증 절차를 수행**해야 함

## 6. 관리자란?

* **정의**: MVE 플랫폼에서 특정 기능을 사용할 수 있는 권한을 부여받은 사용자
* **권한 획득 조건**: **로그인 후 인증된 상태**여야만 함 (이메일+비번 → 서버 검증 → 상태 저장)
* **인증이 필요한 이유**: 권한 있는 작업(설문 생성, 유저 승인 등)은 인증 기반의 보안이 필수

---

## 해야할 일

목표: 다음 주 아마 월요일 오후 때 쯤, 유정님 API 나올 것 같으니까, 그 때 한 번 API 연결 준비하고

1. 주말은 Next.js 강의를 봐주셨으면 합니다.
2. 디자인은 다음 주 오니까, 함께 회의를 통해서 한 번 논의한 후에 태스크 정리 할 겁니다.
3. front-end 보일러 플레이트 상아님하고 함께 다시 한 번 체크합니다 => 디렉토리 구조

1, 2, 3번 태스크를 전부 마치면, 목표를 다시 한 번 봐봅시다.


라우팅 연결 


[id]	필수	string	/post/123
[[id]]	선택	string|undefined	/post/ or /post/123
[[...id]]	선택 + 다중	string[]|undefined	/post/a/b/c or /post




``` tsx 
'use client';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useState } from 'react';


export default function HomePage() {
  const router = useRouter();
   const [search, setSearch] = useState("");

    const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
     const onSubmit = () => {
    if (!search) return;
    router.push(`/page3?a=${search}`); // ✅ app router에서도 사용 가능
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") {
      onSubmit();
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">MVE 설문 시스템</h1>
      <p>여기에 대시보드 또는 로그인 유도 링크 등 넣기</p>
      <Link href="page1">페이지1 가기</Link>
      <Link href="page2">페이지2 가기</Link>
      <Link href="page1/root">페이지2 가기</Link>
      <div>       
        <input value={search} onChange={onChangeSearch} onKeyDown={onKeyDown} placeholder="검색어를 입력하세요 ..." />
        <button onClick={onSubmit}>검색</button></div>
      <div className=" w-full mobile-flex sm:bg-red-900  md:w-1/3 lg:bg-red-100 lg:w-1/2 xl:bg-gray-100 xl:1/1 p-4">
        <div className='bg-blue-300 w-30 h-20'>반응형 박스</div>
        <div className='bg-red-300 w-30 h-20'>반응형 박스</div>
        <div className='bg-green-300 w-30 h-20'>반응형 박스</div>
        <div className='bg-red-800 w-30 h-20'>반응형 박스</div>
      </div>
    </div>
  )
}   



'use client';
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';


export default function HomePage() {

  const router = useSearchParams();
  console.log(router);

  const query = router.get("a") as string;
  
  const params = useParams();
  const [search, setSearch] = useState("");

  const search2 = params.id;

      const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">MVE 설문 시스템</h1>
      <p>여기에 대시보드 또는 로그인 유도 링크 등 넣기</p>
      <Link href="page1">페이지1 가기</Link>
      <Link href="page2">페이지2 가기</Link>
      <Link href="page1/root">페이지2 가기</Link>
      <input placeholder={search} onChange={onChangeSearch}></input>
      <div>{search2}</div>
      <div>{query}</div>
      <div className=" w-full mobile-flex sm:bg-red-900  md:w-1/3 lg:bg-red-100 lg:w-1/2 xl:bg-gray-100 xl:1/1 p-4">
        <div className='bg-blue-300 w-30 h-20'>반응형 박스</div>
        <div className='bg-red-300 w-30 h-20'>반응형 박스</div>
        <div className='bg-green-300 w-30 h-20'>반응형 박스</div>
        <div className='bg-red-800 w-30 h-20'>반응형 박스</div>
      </div>
    </div>
  )
}   
```

react 와 next 차이점

react app 의 테이터 페칭
1. 컴포넌트 마운트 이후에 발생함.
2. 데이터 요청 시점이 느려지는 단점

next app의 데이터 페칭
1. 사전 렌더링중 발생함 (당연히 컴포넌트, 마운트 이후에도 발생가능)
2. 데이터 요청 시점이 매우 빨라지는 장점 있음. 


데이터 패칭 방식 next는 서버에서 데이터를 받아올떄 필요한 api요청데이터 ㅃ까지 받아오기 때문에 요청 시점이 빠르다
빌드 타임 렌더링 