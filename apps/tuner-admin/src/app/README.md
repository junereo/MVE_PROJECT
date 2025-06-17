✅ EC2 인스턴스 생성

    AWS 콘솔 > EC2로 이동

    “인스턴스 시작” 클릭

    Ubuntu 22.04 LTS 선택

    인스턴스 유형: t2.micro (프리 티어면 무료)

    키 페어 생성 (pem 파일 꼭 저장)

    보안 그룹:

    SSH (22), HTTP (80), HTTPS (443), 앱 포트 (3000)

    인스턴스 시작

✅ 보안그룹 설정 (포트 22, 80, 3000 허용)

✅ EC2에 SSH 접속

    chmod 400 your-key.pem
    ssh -i "your-key.pem" ubuntu@<EC2_PUBLIC_IP>

✅ Node.js, Git, PM2 설치

# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Node.js 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Git, PM2 설치
sudo apt install -y git
npm install -g pm2

✅ Step 4: Next.js 앱 복사 or 클론

    git clone https://github.com/your-repo/your-next-app.git
    cd your-next-app

    # 환경변수 설정
    cp .env.example .env.local  # 필요시 수정

    # 패키지 설치
    npm install

    # 빌드
    npm run build


✅ Step 5: next build & pm2로 실행

# 서버 실행 (Next.js는 기본적으로 3000 포트)
pm2 start npm --name "next-app" -- start

# 부팅 시 자동 시작
pm2 startup
pm2 save

✅ Nginx Reverse Proxy 설정

    sudo apt install nginx
    sudo nano /etc/nginx/sites-available/default
```js
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
    sudo systemctl restart nginx


✅ 도메인 연결 + SSL 적용 (옵션)

sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com

🧪 Step 8: 테스트

http://EC2_PUBLIC_IP 또는 도메인 접속
정상 동작 확인

pm2 logs로 로그 확인 가능

