# 1단계: 빌드 스테이지
FROM node:lts-alpine as build-stage
# 2. 앱 디렉토리 생성
WORKDIR /app

# 3. package.json과 package-lock.json 복사
COPY package*.json ./

# 4. 필요한 라이브러리 설치
RUN npm install

# 5. 앱 소스 복사
COPY . .

# 6. 앱 시작
CMD ["npm", "start"]

# 7. 컨테이너가 3000 포트를 사용한다고 알려줌
EXPOSE 3000
