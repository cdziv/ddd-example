# 資料庫測驗

## 題目一

```sql
SELECT amount_group.bnb_id AS bnb_id, bnb.name AS bnb_name, amount_group.may_amount AS may_amount
FROM (
	SELECT bnb_id, SUM(amount) AS may_amount
		FROM orders
		WHERE check_in_date BETWEEN '2023-05-01' AND '2023-05-31' AND
			currency = 'TWD'
		GROUP BY bnb_id
		ORDER BY may_amount DESC
		LIMIT 10
) AS amount_group
JOIN bnbs AS bnb ON bnb.id = amount_group.bnb_id
```

## 題目二

當 SQL 執行效能不佳時，我會先測試看看是哪個欄位的查詢造成效能瓶頸，以題目一的查詢來說，可以個別測試 WHERE 條件下的 check_in_date 和 currency。若想要在最節省儲存空間的策略下，可以僅建立造成效能瓶頸欄位的索引，不過如果查詢需求總是包含著這兩個欄位，則可以建立包含兩個欄位的複合索引，來達到更好的查詢效能。

另外，如果對此搜尋結果的查詢需求非常頻繁但搜尋結果本身並不經常變動（以此例內容是不變的歷史紀錄），例如基於這個查詢結果的統計、報表等等，則可考慮將此查詢結果額外儲存成一張表，並小心數據冗余可能帶來的數據不一致性。

# DDD 實作範例 (創建訂單)

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

> 若還沒有安裝 packages: `npm install`

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

## 設計模式說明

### 概覽

![API 資料處理模式](https://raw.githubusercontent.com/cdziv/ddd-example/9543424cc5c30bff670426e3b5d95ae87344455c/Untitled.jpg)

Http Request 將被 Nest.js Controller 解析為一個 Plain Object，我使用 DTO Assembler 將 Request Body 轉換 Service 的參數或是直接轉換成領域物件。這裡不直接定義一個 model 類並在當中定義雙向轉換邏輯是因為 DTO Assembler 能更好地解耦兩邊資料格式，除了可以應付更複雜的資料格式需求外，也能避免領域資料結構外洩。

因為題目中描述了兩階段的格式驗證，第一層只驗證資料型別，第二層才驗證資料邏輯，所以範例中實作上在第一次轉換並沒有直接轉換成領域物件，否則根據實際需求可以直接轉換成領域物件並作為參數傳入 Service。

在 service 中，主要邏輯都是和領域物件、領域服務互動。我將 order 各個欄位設計為 Value Object，order 則是一個 Aggregate Root，它們各自維護內部的邏輯一制性，若不符規則則拋出 Domain Error。值得一提的是 Domain Error 應該妥善地被 Application Layer 處理，不應直接拋出給 Controller，這種內部的錯誤應該要視為 bug 並拋出 500，這是為了避免領域邏輯外洩。所以雖然在 Value Object 中已經定義了各欄位的資料規則，但我還是在 DTO Assembler 中進行獨立的驗證並在錯誤時拋出 400。

另外 DTO Assembler 應該只專注在資料格式的轉換。像是 **訂單金額限制、匯率轉換** 我認為比較像是商業邏輯，所以將它們寫在 Order Service 和 Order Domain Service 中。

### 領域物件的設計

Post /api/orders 的 Body 格式中每一個欄位都設計成對應的 Value Object，並在其中維護資料與邏輯規則。其中 Address 是一個包含另外 City, District, Street 的 Value Object。而雖然 Body 格式中 Price 和 Currency 是兩個不同欄位，但因為價格的意義通常包含數量及幣別，所以設計了 DecimalAmount 和 Currency，而 Price 是包含了這兩者的 Value Object。

> ‼️ 這裡產生了領域物件與表示層的格式不同的狀況，DTO Assembler 在這邊便發揮了作用。

而 Order 則是一個 Aggregate Root。

## 整體架構設計模式說明

![架構模式](<https://raw.githubusercontent.com/cdziv/ddd-example/06b1212ff92f74fc8085594e8ea8ef596b642f1a/Untitled%20(1).jpg>)

上圖是本次範例的架構

### Domain Layer

領域知識實作的核心區域，此區應該盡量只包含核心的領域邏輯並排除外部系統的協調邏輯。

#### Value Object

不可變的物件，沒有生命週期

#### Entity

具有唯一識別與生命週期的物件

#### Aggregate Root

繼承自 Entity，Aggregate Root 作為對外操作的界面並維護內部邏輯一致性。Aggregate Root 可以發送 Domain Event 通知外部系統

#### Domain Event

Aggregate 符合特定邏輯時所發送出的事件，透過此模式可以有效與外部流程解耦，保留領域邏輯的純粹性

#### Domain Service

領域物件之間可能會彼此互動，若超出聚合根的邊界範圍，則適合在 Domain Service 中進行，例如數個領域物件交互而產生新的領域物件。有時候遇到這種情境時會想要在領域物件上使用靜態方法來生成另外一個領域物件，但這不是好的實踐，因為會增加它們之間的耦合。

> 此範例中，根據當前數值與匯率產生新的價格，便實作在 OrderDomainService 中

### Infrastructure Layer

#### Interface Adapters

Infrastructure Layer 提供者的適配界面，提供者需要實作此界面供應用層注入。這種模式可以避免在外部系統替換時，修改到應用層的程式碼。

### Application Layer

為主要協調各層應用互動的地方。Event Handler、Queue⋯⋯等也適合放在這層。

#### Service

主要流程、商業邏輯實作的地方，與 Presentation Layer 互動。

### Presentation Layer (Controller)

作為應用與外部的界面，將外部資料轉換為 DTO 傳入 Application Layer，並將 Application Layer 的結果轉換為適當的各個介面資料（ex HTTP, CLI⋯⋯）
