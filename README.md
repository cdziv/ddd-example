# DDD 實作範例

## 運行服務

### 使用 Docker

```bash
# 建構映像檔
docker build -t <image name> .

# 執行容器
docker run -d -p 3000:3000 --name <container name> <image name>
```

## 執行測試

```bash
# 單元測試
npm run test

# 端到端測試
npm run test:e2e

# 測試覆蓋率
npm run test:cov
```

## 手動測試資料

在運行服務後，server 將監聽 https://localhost:3000 ，開放的 api 是 POST /api/orders，您可以執行以下指令進行測試：

> ‼️ 本範例實作 id 為 uuid，不合法的 uuid 將回應 400 Bad Request

```bash
# 合法的 body，回應將把 USD 根據匯率 31 轉換為 TWD
curl -X POST http://localhost:3000/api/orders \
     -H "Content-Type: application/json" \
     -d '{
          "id": "d30d4d93-187a-4912-896a-ca2a9e9fb3c8",
          "name": "The Order Name",
          "address": {
            "city": "New Taipei City",
            "district": "Tamsui",
            "street": "hello world street"
          },
          "price": "50",
          "currency": "USD"
        }'

# 不合法的 name
curl -X POST http://localhost:3000/api/orders \
     -H "Content-Type: application/json" \
     -d '{
          "id": "d30d4d93-187a-4912-896a-ca2a9e9fb3c8",
          "name": "The Order Name with No Capitalized words",
          "address": {
            "city": "New Taipei City",
            "district": "Tamsui",
            "street": "hello world street"
          },
          "price": "50",
          "currency": "USD"
        }'

# 不合法的 price (換算成 TWD 後超過 2000)
curl -X POST http://localhost:3000/api/orders \
     -H "Content-Type: application/json" \
     -d '{
          "id": "d30d4d93-187a-4912-896a-ca2a9e9fb3c8",
          "name": "The Order Name",
          "address": {
            "city": "New Taipei City",
            "district": "Tamsui",
            "street": "hello world street"
          },
          "price": "65",
          "currency": "USD"
        }'
```
