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
  - [領域層](#領域層)
  - [應用層](#應用層)
    - [Port](#Port)
  - [基礎設施層](#基礎設施層)
  - [界面適配器](#界面適配器)
    - [應用層](#應用層)
      - [DTO](#dto)
      - [Assembler](#assembler)
      - [Controller](#controller)
- [運行範例](#運行範例)
  - [使用 Docker](#使用-docker)
- [執行測試](#執行測試)

# 建立領域模型

我們將從與領域專家所描述的業務需求中，試著轉換成通用語言（UBIQUITOUS LANGUAGE），再從通用語言中去建立領域模型。

## 通用語言

![通用語言說明圖](https://raw.githubusercontent.com/cdziv/ddd-example/dev/docs/uniquitous-intro.jpg)

通用語言作為領域專家與開發人員之間溝通的共同語言，減少兩邊之間專業語言上的鴻溝。通用語言的核心價值是明確表達兩邊對領域知識的理解，它可以是各種形式，可以是圖或文件。

## 範例需求描述

在本實作範例中，我們假定領域專家將需求整理成以下內容。現實情境中通常不會直接將需求以文字的方式表達，而是會先進行口語上的溝通，在過程中捕捉那些對領域知識深層的理解並慢慢收斂與定義共同語言。

### 情境

- 身為旅宿管理者，可以建立房間並設定房間價格
- 身為旅宿管理者，設定房間價格時可以選擇以 TWD 或 USD 計價
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
- 每個房間必須至少有一張床

**床**

- 分為 Single 和 Double 大小

**訂單**

- 預訂房間後會建立訂單
- 一個訂單可以橫跨連續的天數
- 訂單建立時，發送 email 給用戶

**匯率**

- 當訂單成立時，要將價格要透過當日匯率轉換成用戶選擇的支付幣別
- 當日匯率要跟外部 API 索取資料

## 解釋性模型

![解釋性模型圖](https://raw.githubusercontent.com/cdziv/ddd-example/dev/docs/uniquitous-diagram.jpg)
我們試著將領域專家描述的需求，畫成解釋性模型來作為我們的通用語言的一部分。通用語言的圖並不一定限於嚴謹的 UML。UML 表達了程式實作的細節，但這些對於在和領域專家溝通上來說過於細瑣與不必要，通用語言的重點在於溝通與解釋。

有時候光使用圖可能會不夠表達更細節的內容，可以搭配文件補足。

# 模型驅動設計

在這個階段，我們要開始將領域模型實作成軟體中的模型。先簡單描述一下相關概念：

## 領域不變量

領域不變量（Domain Invariant）是指在領域上下文中的條件限制。領域物件們必須遵守不變量。

以範例需求來說，像是**價格**不能為負數。

## 值物件

值物件（Value Object）是包含領域概念的一到多個屬性的集合。有以下幾個限制條件：

- 沒有唯一識別、不具生命週期。當兩個值物件內的屬性彼此相等時，兩個值物件視為相同。
- 不可變 （immutable）。
- 需要嚴格定義與規範屬性的規則並遵守領域不變量，值物件不應該存在不合法的時候。

以範例需求來說，Address 可以被定義為一個值物件，包含著屬性 City、District、Street，一個完整的地址應該要包含這三個屬性，所以 Address 被建立時必須確保屬性們都符合其規格。Address 可以擁有 getCity, getDistrict, getStreet, getFullAddress 等方法，來滿足領域知識的用例。

## 實體

實體（Entity）是主要封裝領域知識、商業邏輯的地方，它的屬性可以是值物件。有以下幾個限制條件：

- 必須擁有唯一識別，具有生命週期。當兩個實體的唯一識別相等時，兩個實體視為同一實體。
- 需要嚴格定義與規範屬性的規則並遵守領域不變量、維護內部的狀態，實體不應該存在不合法的時候。

## 聚合根

聚合根（Aggregate Root）封裝了領域知識上下文邊界，維護邊界內的邏輯一致性，同時也作為上下文邊界與外界的出入口。聚合根能對外發佈領域事件（Domain Event），提供外界聚合根變化的資訊。有以下幾個限制條件：

- 聚合根實作上繼承自實體，所以擁有實體的限制。
- 聚合根內部的運算必須是「事務操作」（Transactional）。
- 聚合根之間不能互相包含，它們必須透過唯一識別來引用。

## 領域服務

有些時候屬於領域知識的邏輯可能會跨數個值物件或聚合根，譬如根據數個領域物件計算出一個新的領域物件，這時候就適合使用領域服務。

## 範例需求上下文

![範例需求上下文](https://raw.githubusercontent.com/cdziv/ddd-example/dev/docs/spec-context.jpg)

# 架構

![架構圖](https://raw.githubusercontent.com/cdziv/ddd-example/dev/docs/architecture.jpg)

## 領域層

領域層包含**聚合根**、**值物件**、**領域事件**、**領域服務**，主要的領域知識應該要包裹在這層中，並且盡可能減少外部依賴。

## 應用層

應用層協調各項服務與領域層之間的互動，例如透過 Ports 呼叫基礎設施服務、處理領域事件⋯⋯等等。

### Port

Port 是應用層呼叫基礎設施層服務的界面，透過依賴注入的方式將其注入應用層的服務，可以避免應用層直接地與外部系統耦合。

## 基礎設施層

基礎設施層（Infrastructure Layer）是實作與外部系統互動的地方，例如操作資料庫、呼叫外部服務、訊息佇列、快取⋯⋯等等。

## 界面適配器

界面適配器（Interface Adapters）將使用者輸入的資料轉換成方便應用層使用的資料，也可以反向將應用資料轉換成使用者接收的資料。

### DTO

DTO（Data Transfer Object）將資料轉換為固定格式的物件並將其在服務之間傳遞，確保資料格式符合預期。若需要，DTO 可以包含資料驗證的邏輯在其中。

### Assembler

Assembler 是 DTO 和領域物件的轉換器。透過 Assembler 將領域物件與 DTO 區分開來，我們可以避免領域模型外洩。本範例將 Assembler 實作於應用層內。

### Controller

在 Nest.js 中，Controller 定義了 API 的接口，同時可以透過 Pipe 功能將序列化資料轉換成 DTO。在範例中，對於資料的驗證實作於 Pipe 中。

# 運行範例

## 使用 Docker

```bash
# 建構映像檔
docker build -t <image name> .

# 執行容器
docker run -d -p 3000:3000 --name <container name> <image name>
```

# 執行測試

```bash

# 單元測試
npm run test

# 端到端測試
npm run test:e2e

# 測試覆蓋率
npm run test:cov
```

> 若還沒有安裝 packages: `npm install`
