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
정상 가동되는지 확인. RabbitMQ가 기동하는데 시간이 좀 소요됨
```bash
kubectl get all

NAME                                     READY   STATUS    RESTARTS   AGE
pod/my-rabbit-server-0                   1/1     Running   0          48s
pod/rabbitmq-consumer-7dd59dd85-cl6rr    1/1     Running   0          49s
pod/rabbitmq-producer-586cff599b-knggt   1/1     Running   0          49s

NAME                        TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                        AGE
service/kubernetes          ClusterIP   10.96.0.1       <none>        443/TCP                        65m
service/my-rabbit           ClusterIP   10.105.28.157   <none>        5672/TCP,15672/TCP,15692/TCP   48s
service/my-rabbit-nodes     ClusterIP   None            <none>        4369/TCP,25672/TCP             48s
service/my-rabbit-ui        NodePort    10.100.246.60   <none>        15672:31567/TCP                49s
service/rabbitmq-consumer   ClusterIP   10.108.97.74    <none>        3000/TCP                       49s
service/rabbitmq-producer   ClusterIP   10.96.151.34    <none>        3000/TCP                       49s

NAME                                READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/rabbitmq-consumer   1/1     1            1           49s
deployment.apps/rabbitmq-producer   1/1     1            1           49s

NAME                                           DESIRED   CURRENT   READY   AGE
replicaset.apps/rabbitmq-consumer-7dd59dd85    1         1         1       49s
replicaset.apps/rabbitmq-producer-586cff599b   1         1         1       49s

NAME                                READY   AGE
statefulset.apps/my-rabbit-server   1/1     48s

NAME                                     ALLREPLICASREADY   RECONCILESUCCESS   AGE
rabbitmqcluster.rabbitmq.com/my-rabbit   True               True               49s
```

RabbitMQ UI 접속 : http://127.0.0.1:15672/
1. 로그인 admin/admin
2. Producer 접속 : http://127.0.0.1:31001
3. 원하는 숫자를 입력하면 자동으로 메세지 전송
4. Consumer 접속 : http://127.0.0.1:31002
5. api 호출로 테스트
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