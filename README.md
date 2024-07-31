# 在 Nest.js 上實作領域驅動設計

- [建立領域模型](#建立領域模型)
  - [通用語言](#通用語言)
  - [需求描述](#需求描述)
    - [情境](#情境)
    - [業務邏輯](#業務邏輯)
  - [解釋性模型](#解釋性模型)
- [模型驅動設計](#模型驅動設計)
  - [領域不變量](#領域不變量)
  - [值物件](#值物件)
  - [實體](#實體)
  - [聚合根](#聚合根)
  - [範例需求上下文](#範例需求上下文)
- [架構](#架構)
- [運行範例](#運行範例)

# 建立領域模型

我們將從與領域專家所描述的業務需求中，試著轉換成通用語言（UBIQUITOUS LANGUAGE），再從通用語言中去建立領域模型。

## 通用語言

通用語言作為領域專家與開發人員之間溝通的共同語言，減少兩邊之間專業語言上的鴻溝。通用語言的核心價值是明確表達兩邊對領域知識的理解，它可以是各種形式，可以是圖或文件。

## 範例需求描述

在本實作範例中，我們假定領域專家將需求整理成以下內容。現實情境中通常不會直接將需求以文字的方式表達，而是會先進行口語上的溝通，在過程中捕捉那些對領域知識深層的理解並慢慢收斂與定義共同語言。

### 情境

- 身為旅宿管理者，可以建立房間並設定房間價格
- 身為旅宿管理者，設定房間價格時可以選擇以 TWD 或 USD 計價
- 身為旅宿管理者，可以在訂單上添加筆記
- 身為用戶，可以根據日期區間查詢一個旅宿可預訂的房間資訊
- 身為用戶，在查詢房間資訊時可以設定以 TWD 或 USD 計價
- 身為用戶，可以對預訂房間
- 身為用戶，預訂房間時使用查詢房間時的幣別支付

### 業務邏輯

**旅宿**

- 一個旅宿可以有多個管理員
- 一個旅宿擁有多個房間
- 旅宿有以下基本資料
  - 名稱
  - 地址（內容需細分為以下資料，方便查找）
    - 城市
    - 區
    - 街道門牌

**房間**

- 房間可以設定價格
- 價格可以用 TWD 或 USD 計價

**訂單**

- 預訂房間後會建立訂單
- 一個訂單可以橫跨連續的天數
- 訂單建立時，發送 email 給用戶

**匯率**

- 當訂單成立時，要將價格要透過當日匯率轉換成用戶選擇的支付幣別
- 當日匯率要跟外部 API 索取資料

## 解釋性模型

我們試著將領域專家描述的需求，畫成解釋性模型來作為我們的通用語言的一部分。通用語言的圖並不一定限於嚴謹的 UML。UML 表達了程式實作的細節，但這些對於在和領域專家溝通上來說過於細瑣與不必要，通用語言的重點在於溝通與解釋。

有時候光使用圖可能會不夠表達更細節的內容，可以搭配文件補足。

# 模型驅動設計

在這個階段，我們要開始將領域模型實作成軟體中的模型。先簡單描述一下相關概念：

## 領域不變量

領域不變量（Domain Invariant）是指在領域上下文中的條件限制。領域物件們必須遵守不變量。

以範例需求來說，像是**價格**不能為負數。

## 值物件

值物件（Value Object）是包含領域概念的一到多個屬性的集合。有以下幾個限制條件：

- 沒有唯一識別、不具生命週期。當兩個值物件內的屬性彼此相等時，兩個值物件視為相同
- 不可變 （immutable）
- 需要嚴格定義與規範屬性的規則並遵守領域不變量，值物件不應該存在不合法的時候

以範例需求來說，Address 可以被定義為一個值物件，包含著屬性 City、District、Street，一個完整的地址應該要包含這三個屬性，所以 Address 被建立時必須確保屬性們都符合其規格。Address 可以擁有 getCity, getDistrict, getStreet, getFullAddress 等方法，來滿足領域知識的用例。

## 實體

實體（Entity）是主要封裝領域知識、商業邏輯的地方，它的屬性可以是值物件。有以下幾個限制條件：

- 必須擁有唯一識別，具有生命週期。當兩個實體的唯一識別相等時，兩個實體視為同一實體
- 需要嚴格定義與規範屬性的規則並遵守領域不變量、維護內部的狀態，實體不應該存在不合法的時候

## 聚合根

聚合根（Aggregate Root）封裝了領域知識上下文邊界，維護邊界內的邏輯一致性，同時也作為上下文邊界與外界的出入口。聚合根能對外發佈領域事件（Domain Event），提供外界聚合根變化的資訊。有以下幾個限制條件：

- 聚合根實作上繼承自實體，所以擁有實體的限制
- 聚合根內部的運算必須是「事務操作」（Transactional）
- 聚合根之間不能互相包含，它們必須透過唯一識別來引用

## 範例需求上下文

# 架構

# 運行範例

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
