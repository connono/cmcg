# Consumable API 文档

## 1. 创建耗材申请

### 请求
- **URL**: `/api/consumables`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "platform_id": "平台唯一标识",
    "department": "申请科室",
    "consumable": "耗材名称",
    "model": "规格型号",
    "price": 199.00,
    "start_date": "2024-01-01",
    "exp_date": "2025-01-01",
    "registration_num": "注册证号",
    "company": "生产企业",
    "manufacturer": "生产厂商",
    "category_zj": "浙江分类目录",
    "parent_directory": "父级目录",
    "child_directory": "子级目录",
    "apply_type": {
      "description": "采购类型（必填）",
      "enum": [
        "bid_product",
        "sunshine_purchase",
        "self_purchase",
        "offline_purchase",
        "volume_purchase"
      ],
      "example": "sunshine_purchase"
    },
    "in_drugstore": true,
    "need_selection": true,
    "medical_approval_file": "医疗审批单文件ID"
  }
  ```

### 响应
- **成功** (201 Created):
  ```json
  {
    "message": "耗材申请创建成功",
    "data": {
      "consumable": {
        "id": 1,
        "consumable": "耗材名称",
        "department": "申请科室",
        "apply_type": 1,
        "need_selection": true,
        "selection_reason": "遴选原因",
        "estimated_cost": 1000.00,
        "supplier_info": "供应商信息",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
      },
      "state": {
        "id": 1,
        "consumable_id": 1,
        "state": "applied",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
      }
    }
  }
  ```
- **失败** (500 Internal Server Error):
  ```json
  {
    "message": "创建失败",
    "error": "错误信息"
  }
  ```

## 2. 获取耗材申请列表

### 请求
- **URL**: `/api/consumables`
- **方法**: `GET`
- **查询参数**:
  - `states`: 状态筛选，多个状态用逗号分隔，例如 `applied,selection_input`
  - `department`: 科室筛选
  - `consumable`: 耗材名称筛选（模糊匹配）
  - `apply_type`: 申请类型筛选（0:中标产品, 1:阳光采购, 2:自行采购, 3:线下采购, 4:带量采购）
  - `need_selection`: 是否需要遴选筛选（true/false）
  - `start_date`: 开始日期筛选
  - `end_date`: 结束日期筛选
  - `sort_field`: 排序字段，默认 `created_at`
  - `sort_direction`: 排序方向，默认 `desc`
  - `per_page`: 每页记录数，默认 15

### 响应
- **成功** (200 OK):
  ```json
  {
    "data": [
      {
        "id": 1,
        "consumable": "耗材名称",
        "department": "申请科室",
        "apply_type": 1,
        "need_selection": true,
        "selection_reason": "遴选原因",
        "estimated_cost": 1000.00,
        "supplier_info": "供应商信息",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z",
        "current_state": {
          "id": 1,
          "consumable_id": 1,
          "state": "applied",
          "created_at": "2023-01-01T00:00:00.000000Z",
          "updated_at": "2023-01-01T00:00:00.000000Z"
        },
        "state_events": [
          {
            "id": 1,
            "consumable_id": 1,
            "state": "applied",
            "created_at": "2023-01-01T00:00:00.000000Z",
            "updated_at": "2023-01-01T00:00:00.000000Z"
          }
        ]
      }
    ],
    "links": {
      "first": "http://example.com/api/consumables?page=1",
      "last": "http://example.com/api/consumables?page=1",
      "prev": null,
      "next": null
    },
    "meta": {
      "current_page": 1,
      "from": 1,
      "last_page": 1,
      "path": "http://example.com/api/consumables",
      "per_page": 15,
      "to": 1,
      "total": 1
    }
  }
  ```

## 3. 更新耗材状态

### 请求
- **URL**: `/api/consumables/{consumable}`
- **方法**: `PUT`
- **请求体**:
  ```json
  {
    "approved": true/false,
    "selection_reason": "遴选原因（可选，仅在selection_input状态有效）",
    "estimated_cost": 1000.00（可选，仅在selection_input状态有效）,
    "supplier_info": "供应商信息（可选，仅在selection_input状态有效）",
    "sunshine_purchase_file": "阳光采购文件路径（可选，仅在selection_input状态且apply_type为1时有效）",
    "bid_purchase_file": "中标采购文件路径（可选，仅在selection_input状态且apply_type为0时有效）"
  }
  ```

### 响应
- **成功** (200 OK):
  ```json
  {
    "message": "审核操作成功",
    "data": {
      "consumable": {
        "id": 1,
        "consumable": "耗材名称",
        "department": "申请科室",
        "apply_type": 1,
        "need_selection": true,
        "selection_reason": "遴选原因",
        "estimated_cost": 1000.00,
        "supplier_info": "供应商信息",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
      },
      "state": {
        "id": 1,
        "consumable_id": 1,
        "state": "selection_input",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
      }
    }
  }
  ```
- **失败** (400 Bad Request):
  ```json
  {
    "message": "遴选录入状态不允许拒绝操作",
    "error": "Invalid operation"
  }
  ```
- **失败** (500 Internal Server Error):
  ```json
  {
    "message": "审核操作失败",
    "error": "错误信息"
  }
  ```

## 状态流转说明

### 申请阶段 (applied)
- 分管领导审核
  - 通过且需要遴选 → `selection_input`
  - 通过且不需要遴选 → `in_use`
  - 不通过 → `disabled`

### 遴选录入 (selection_input)
- 更新 Consumable 属性（遴选原因、预估成本、供应商信息等）
- 阳光采购：上传阳光采购文件 → `sunshine_selection_medical`
- 中标采购：上传中标采购文件 → `bid_selection`

### 阳光采购路线（2层审批）
- `sunshine_selection_medical`（医工科审核）→ 通过进入 `sunshine_selection_director`，不通过退回 `selection_input`
- `sunshine_selection_director`（分管院长审核）→ 通过进入 `in_use`，不通过退回 `selection_input`

### 中标采购路线（1层审批）
- `bid_selection`（准入分管领导审核）→ 通过进入 `in_use`，不通过退回 `selection_input`
