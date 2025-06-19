✅ [최종 실행 체크리스트] - Next.js + AWS EC2 배포 플로우 (mve-front 기준)
🔷 1. 도메인 세팅
1-1. 가비아에서 도메인 구매
예: mve-front.store

1-2. AWS Route 53에서 호스팅 영역 생성
Route 53 → 호스팅 영역 → mve-front.store 생성

1-3. NS(NameServer) 레코드 복사
Route 53 생성된 호스팅 영역에서 NS 레코드 4개 확인

가비아 DNS 관리에서 네임서버 변경 → AWS NS 레코드 4개 붙여넣기

1-4. A 레코드 설정 (2개)
Route 53에서 A 레코드 추가:

mve-front.store → EC2의 퍼블릭 IPv4 또는 탄력 IP

admin.mve-front.store → 동일한 EC2 또는 다른 인스턴스 IP

🔷 2. EC2 인스턴스 생성 및 접속
2-1. EC2 인스턴스 2개 생성
mve-front, mve-api

OS: Ubuntu 22.04 LTS

유형: t2.micro (프리티어)

포트 허용: 22, 80, 443, 3000

2-2. 탄력 IP 연결 (공인 IP 고정)
EC2 → 탄력 IP → 할당 및 인스턴스에 연결

2-3. SSH 접속
bash
복사
편집
chmod 400 your-key.pem
ssh -i "your-key.pem" ubuntu@<탄력 IP 주소>
🔷 3. 서버 초기 설정
bash
복사
편집
# 필수 패키지 설치
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs git nginx
npm install -g pm2
🔷 4. Next.js 앱 배포 (mve-front 기준)
bash
복사
편집
git clone https://github.com/your-repo/your-next-app.git
cd your-next-app
cp .env.example .env.local
npm install
npm run build

pm2 start npm --name "mve-front" -- start
pm2 save
pm2 startup
🔷 5. Nginx 설정
bash
복사
편집
sudo nano /etc/nginx/sites-available/default
예시:
nginx
복사
편집
server {
    listen 80;
    server_name mve-front.store admin.mve-front.store;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
bash
복사
편집
sudo systemctl restart nginx
🔷 6. HTTPS 인증서 발급 (Certbot)
bash
복사
편집
sudo apt install certbot python3-certbot-nginx -y

sudo certbot --nginx -d mve-front.store -d admin.mve-front.store
도중에 이메일 입력, 약관 동의, HTTP → HTTPS 리디렉션 여부 등 기본 옵션 선택

🔷 7. 자동 갱신 확인
bash
복사
편집
sudo certbot renew --dry-run
정상 출력되면 인증서 자동 갱신 OK

🔷 8. 브라우저 테스트
✅ https://mve-front.store

✅ https://admin.mve-front.store

자물쇠 아이콘 표시 + HTTPS 연결 여부 확인

🔧 참고: CORS, 쿠키 도메인 분리 적용
mve-api.store와 mve-front.store는 서로 다른 도메인임

CORS 정책 필요 시, API 서버 응답 헤더에 Access-Control-Allow-Origin: https://mve-front.store 지정 필요

쿠키는 SameSite=None; Secure 옵션 필요 (HTTPS에서만 작동)



## ✅ Next.js + AWS 배포 체크리스트 (mve-front 기준)

### 🔷 1. 도메인 세팅 (가비아 + Route 53)
- [ ] 가비아에서 `mve-front.store` 도메인 구매
- [ ] AWS Route 53 → 호스팅 영역 생성 (`mve-front.store`)
- [ ] Route 53 → NS 레코드 4개 복사
- [ ] 가비아 도메인 관리 → 네임서버(NS) 변경 → AWS NS 4개 붙여넣기

### 🔷 2. A 레코드 설정 (도메인 ↔ 서버 IP 연결)
- [ ] Route 53 → A 레코드 추가: `mve-front.store` → 프론트 EC2 IP
- [ ] Route 53 → A 레코드 추가: `admin.mve-front.store` → 프론트 EC2 IP

### 🔷 3. EC2 인스턴스 생성 및 설정
- [ ] EC2 인스턴스 1개 생성 (이름: `mve-front`)
- [ ] 인스턴스 OS: Ubuntu 22.04 LTS / 타입: t2.micro
- [ ] 보안 그룹: 포트 22, 80, 443, 3000 허용
- [ ] 탄력 IP 할당 및 인스턴스에 연결
- [ ] SSH 접속 확인 (`chmod 400`, `ssh -i`)

### 🔷 4. 서버 초기 세팅
- [ ] 시스템 업데이트  
  `sudo apt update && sudo apt upgrade -y`
- [ ] Node.js 18 설치  
  `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -`  
  `sudo apt install -y nodejs`
- [ ] Git, Nginx, PM2 설치  
  `sudo apt install -y git nginx`  
  `npm install -g pm2`

### 🔷 5. Next.js 앱 배포
- [ ] Git에서 프로젝트 클론 or 직접 업로드
- [ ] `.env.local` 등 환경변수 설정
- [ ] 의존성 설치 (`npm install`)
- [ ] 앱 빌드 (`npm run build`)
- [ ] 앱 실행 및 PM2 등록  
  `pm2 start npm --name "mve-front" -- start`  
  `pm2 save && pm2 startup`

### 🔷 6. Nginx 설정
- [ ] `/etc/nginx/sites-available/default` 수정
- [ ] `server_name`에 `mve-front.store`, `admin.mve-front.store` 등록
- [ ] `proxy_pass http://localhost:3000;` 설정
- [ ] Nginx 재시작  
  `sudo systemctl restart nginx`

### 🔷 7. HTTPS 인증서 적용 (Certbot)
- [ ] Certbot 설치  
  `sudo apt install certbot python3-certbot-nginx -y`
- [ ] HTTPS 인증서 발급  
  `sudo certbot --nginx -d mve-front.store -d admin.mve-front.store`

### 🔷 8. 인증서 자동 갱신 테스트
- [ ] 자동 갱신 dry-run 테스트  
  `sudo certbot renew --dry-run`

### 🔷 9. 최종 확인
- [ ] https://mve-front.store 접속 확인 (🔒 자물쇠 보임)
- [ ] https://admin.mve-front.store 접속 확인 (🔒 보안 연결)
- [ ] `pm2 logs`로 앱 상태 확인