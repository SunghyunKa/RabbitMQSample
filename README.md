# Windows RabbitMQ + Kubernetes 개발환경 설치 가이드

## 1. 필수 설치 프로그램

### Docker Desktop
- Kubernetes 환경 구축에 필요합니다.
- [Docker Desktop 다운로드](https://www.docker.com/products/docker-desktop)

**설치 후:**
- Docker Desktop 설정에서 Kubernetes를 활성화하지 않아도 됩니다. (Minikube 사용 예정)

---

### Minikube
- 로컬 Kubernetes 클러스터를 실행하는 도구입니다.
- [Minikube 설치 가이드](https://minikube.sigs.k8s.io/docs/start/)

**설치 후 실행:**
```bash
minikube start
```

---

### kubectl
- Kubernetes 클러스터를 제어하는 CLI 도구입니다.
- [kubectl 설치 가이드](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

**설치 확인:**
```bash
kubectl version --client
```

---

### Skaffold
- Kubernetes 애플리케이션 개발 및 배포 자동화 도구입니다.
- [Skaffold 설치 가이드](https://skaffold.dev/docs/install/)

**설치 확인:**
```bash
skaffold version
```
## 2. RabbitMQ 설치

### Operator 설치
```bash
kubectl apply -f https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml
```

## 3. 프로젝트 실행
```bash
minikube start
skaffold dev --port-forward
```

RabbitMQ UI 접속 : http://127.0.0.1:15672/
계정 생성 필요
1. 로그인 admin/admin
2. Admin 탭 이동
3. user/user1234 로 정보 입력 후 [Add user] 클릭
4. 생성된 user 들어가서 [Set permission], [Set topic permission] 클릭 후 비밀번호에 user1234 입력 후 [Update user] 클릭
5. 로그에 consumer가 접속되는지 확인
6. Producer 접속 : http://127.0.0.1:31001
7. 원하는 숫자를 입력하면 자동으로 메세지 전송
8. api 호출로 테스트
POST http://127.0.0.1:31001/send/push
```json
{
  "pushId": "push_test_001",
  "tokenIds": [
    "token_1",
    "token_2",
    "token_3"]
}
```