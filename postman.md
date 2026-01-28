# 🧪 Postman Testing Guide - AmarShikkhok API

এই ডকুমেন্টে সব API endpoints এর জন্য Postman দিয়ে testing করার complete guide আছে। এটি সরাসরি কপি-পেস্ট করে ব্যবহার করা যাবে।

---

## 📌 Postman Setup

### Step 1: Environment Variables তৈরি করো

Postman এ একটা Environment তৈরি করো (যেমন: "AmarShikkhok-Dev") এবং নিচের variables গুলো যোগ করো:

| Variable Name     | Initial Value           | Description             |
| ----------------- | ----------------------- | ----------------------- |
| `base_url`        | `http://localhost:5000` | Backend server URL      |
| `student_token`   | (খালি রাখো)             | Student login token     |
| `tutor_token`     | (খালি রাখো)             | Tutor login token       |
| `admin_token`     | (খালি রাখো)             | Admin login token       |
| `tutor_id`        | (খালি রাখো)             | Tutor profile ID        |
| `booking_id`      | (খালি রাখো)             | Booking ID for testing  |
| `category_id`     | (খালি রাখো)             | Category ID for testing |
| `availability_id` | (খালি রাখো)             | Availability slot ID    |

### Step 2: Collection তৈরি করো

Postman এ একটা নতুন Collection তৈরি করো: **"AmarShikkhok API"**

---

## 🔐 1. Authentication APIs

### 1.1 Register Student (নতুন শিক্ষার্থী রেজিস্টার)

**Method:** `POST`  
**Endpoint:** `{{base_url}}/api/auth/register`  
**Headers:** `Content-Type: application/json`

**Body (JSON):**

```json
{
  "name": "Rahim Ahmed",
  "email": "student@test.com",
  "password": "password123",
  "role": "STUDENT",
  "phone": "01700000000"
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid...",
      "name": "Rahim Ahmed",
      "email": "student@test.com",
      "role": "STUDENT"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.2 Register Tutor (নতুন টিউটর রেজিস্টার)

**Method:** `POST`  
**Endpoint:** `{{base_url}}/api/auth/register`

**Body (JSON):**

```json
{
  "name": "Karim Sir",
  "email": "tutor@test.com",
  "password": "password123",
  "role": "TUTOR",
  "phone": "01800000000"
}
```

---

### 1.3 Login (লগইন করা)

**Method:** `POST`  
**Endpoint:** `{{base_url}}/api/auth/login`

**Body (JSON):**

```json
{
  "email": "student@test.com",
  "password": "password123"
}
```

**🚀 Pro Tip - Auto Token Save:**

Postman এর **Tests** ট্যাবে নিচের কোডটি পেস্ট করো:

```javascript
const response = pm.response.json();

if (response.success && response.data.token) {
  const role = response.data.user.role;
  const token = response.data.token;

  if (role === "STUDENT") {
    pm.environment.set("student_token", token);
    console.log("✅ Student token saved!");
  }
  if (role === "TUTOR") {
    pm.environment.set("tutor_token", token);
    console.log("✅ Tutor token saved!");
  }
  if (role === "ADMIN") {
    pm.environment.set("admin_token", token);
    console.log("✅ Admin token saved!");
  }

  pm.test("Login successful", function () {
    pm.expect(response.success).to.be.true;
    pm.expect(token).to.be.a("string");
  });
}
```

---

### 1.4 Get Me (নিজের প্রোফাইল দেখা)

**Method:** `GET`  
**Endpoint:** `{{base_url}}/api/auth/me`  
**Auth:** Bearer Token → `{{student_token}}` (অথবা tutor/admin token)

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid...",
    "name": "Rahim Ahmed",
    "email": "student@test.com",
    "role": "STUDENT",
    "phone": "01700000000",
    "isActive": true,
    "isBanned": false
  }
}
```

---

## 📚 2. Category APIs

### 2.1 Get All Categories (Public)

**Method:** `GET`  
**Endpoint:** `{{base_url}}/api/categories`  
**Auth:** None (Public)

**Expected Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid...",
      "name": "Mathematics",
      "description": "All levels of mathematics and calculus",
      "tutorCount": 15,
      "createdAt": "2026-01-28T10:00:00Z"
    },
    {
      "id": "uuid...",
      "name": "Physics",
      "description": "Physics for all grades",
      "tutorCount": 8
    }
  ]
}
```

---

### 2.2 Create Category (Admin Only)

**Method:** `POST`  
**Endpoint:** `{{base_url}}/api/categories`  
**Auth:** Bearer Token → `{{admin_token}}`

**Body:**

```json
{
  "name": "Mathematics",
  "description": "All levels of mathematics and calculus"
}
```

**🔧 Tests Tab:**

```javascript
const response = pm.response.json();
if (response.success && response.data.id) {
  pm.environment.set("category_id", response.data.id);
  console.log("✅ Category ID saved:", response.data.id);
}
```

---

### 2.3 Update Category (Admin Only)

**Method:** `PUT`  
**Endpoint:** `{{base_url}}/api/categories/{{category_id}}`  
**Auth:** Bearer Token → `{{admin_token}}`

**Body:**

```json
{
  "name": "Advanced Mathematics",
  "description": "Higher level mathematics including calculus and algebra"
}
```

---

### 2.4 Delete Category (Admin Only)

**Method:** `DELETE`  
**Endpoint:** `{{base_url}}/api/categories/{{category_id}}`  
**Auth:** Bearer Token → `{{admin_token}}`

---

## 👨‍🏫 3. Tutor APIs

### 3.1 Get All Tutors (Public - with filters)

**Method:** `GET`  
**Endpoint:** `{{base_url}}/api/tutors`

**Query Parameters (সব optional):**

- `category` - Category name দিয়ে ফিল্টার
- `minPrice` - Minimum hourly rate
- `maxPrice` - Maximum hourly rate
- `rating` - Minimum rating (1-5)
- `search` - Name/subject দিয়ে সার্চ

**Example:**

```
{{base_url}}/api/tutors?category=Mathematics&minPrice=500&maxPrice=2000&rating=4&search=calculus
```

---

### 3.2 Get Single Tutor Details (Public)

**Method:** `GET`  
**Endpoint:** `{{base_url}}/api/tutors/{{tutor_id}}`

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid...",
    "user": {
      "name": "Karim Sir",
      "email": "tutor@test.com",
      "profileImage": "https://..."
    },
    "bio": "Experienced Math teacher from DU",
    "expertise": ["Calculus", "Algebra", "Geometry"],
    "hourlyRate": 1200,
    "experience": 5,
    "education": "MSc in Mathematics",
    "rating": 4.8,
    "totalReviews": 45,
    "totalSessions": 120,
    "categories": [{ "id": "...", "name": "Mathematics" }],
    "reviews": [
      {
        "id": "...",
        "rating": 5,
        "comment": "Excellent teacher!",
        "student": { "name": "Rahim Ahmed" }
      }
    ]
  }
}
```

---

### 3.3 Create/Update Tutor Profile (Tutor Only)

**Method:** `PUT`  
**Endpoint:** `{{base_url}}/api/tutor/profile`  
**Auth:** Bearer Token → `{{tutor_token}}`

**Body:**

```json
{
  "bio": "Experienced Math teacher from DU. Focused on SSC/HSC students.",
  "expertise": ["Calculus", "Algebra", "Geometry", "Trigonometry"],
  "hourlyRate": 1200,
  "experience": 5,
  "education": "MSc in Mathematics, University of Dhaka",
  "categoryIds": ["category_uuid_here"]
}
```

**🔧 Tests Tab:**

```javascript
const response = pm.response.json();
if (response.success && response.data.id) {
  pm.environment.set("tutor_id", response.data.id);
  console.log("✅ Tutor ID saved:", response.data.id);
}
```

---

### 3.4 Add Availability Slot (Tutor Only)

**Method:** `POST`  
**Endpoint:** `{{base_url}}/api/tutor/availability`  
**Auth:** Bearer Token → `{{tutor_token}}`

**Body:**

```json
{
  "dayOfWeek": 1,
  "startTime": "10:00",
  "endTime": "18:00"
}
```

**Day of Week:**

- 0 = Sunday
- 1 = Monday
- 2 = Tuesday
- 3 = Wednesday
- 4 = Thursday
- 5 = Friday
- 6 = Saturday

---

### 3.5 Update Availability Slot (Tutor Only)

**Method:** `PUT`  
**Endpoint:** `{{base_url}}/api/tutor/availability`  
**Auth:** Bearer Token → `{{tutor_token}}`

**Body:**

```json
{
  "dayOfWeek": 1,
  "startTime": "09:00",
  "endTime": "17:00",
  "isAvailable": true
}
```

---

### 3.6 Get Tutor's Bookings (Tutor Only)

**Method:** `GET`  
**Endpoint:** `{{base_url}}/api/tutor/bookings`  
**Auth:** Bearer Token → `{{tutor_token}}`

**Query Parameters:**

- `status` - Filter by status (CONFIRMED, COMPLETED, CANCELLED)

---

## 📖 4. Booking APIs

### 4.1 Create Booking (Student Only)

**Method:** `POST`  
**Endpoint:** `{{base_url}}/api/bookings`  
**Auth:** Bearer Token → `{{student_token}}`

**Body:**

```json
{
  "tutorId": "tutor_uuid_here",
  "subject": "Mathematics",
  "sessionDate": "2026-02-15T00:00:00Z",
  "startTime": "11:00",
  "endTime": "12:00",
  "notes": "Need help with Trigonometry chapter 7 and 8."
}
```

**🔧 Tests Tab:**

```javascript
const response = pm.response.json();
if (response.success && response.data.id) {
  pm.environment.set("booking_id", response.data.id);
  console.log("✅ Booking ID saved:", response.data.id);
}
```

---

### 4.2 Get My Bookings (Student/Tutor)

**Method:** `GET`  
**Endpoint:** `{{base_url}}/api/bookings`  
**Auth:** Bearer Token → `{{student_token}}` OR `{{tutor_token}}`

**Query Parameters:**

- `status` - Filter by status (optional)

**Example:**

```
{{base_url}}/api/bookings?status=CONFIRMED
```

---

### 4.3 Get Booking Details (Student/Tutor)

**Method:** `GET`  
**Endpoint:** `{{base_url}}/api/bookings/{{booking_id}}`  
**Auth:** Bearer Token → `{{student_token}}` OR `{{tutor_token}}`

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid...",
    "student": {
      "id": "...",
      "name": "Rahim Ahmed",
      "email": "student@test.com",
      "phone": "01700000000"
    },
    "tutor": {
      "id": "...",
      "name": "Karim Sir",
      "hourlyRate": 1200
    },
    "subject": "Mathematics",
    "sessionDate": "2026-02-15T00:00:00Z",
    "startTime": "11:00",
    "endTime": "12:00",
    "status": "CONFIRMED",
    "notes": "Need help with Trigonometry chapter 7 and 8.",
    "totalPrice": 1200,
    "createdAt": "2026-01-28T10:00:00Z"
  }
}
```

---

### 4.4 Complete Booking (Tutor Only)

**Method:** `PATCH`  
**Endpoint:** `{{base_url}}/api/bookings/{{booking_id}}/complete`  
**Auth:** Bearer Token → `{{tutor_token}}`

---

### 4.5 Cancel Booking (Student Only)

**Method:** `PATCH`  
**Endpoint:** `{{base_url}}/api/bookings/{{booking_id}}/cancel`  
**Auth:** Bearer Token → `{{student_token}}`

---

## ⭐ 5. Review APIs

### 5.1 Create Review (Student Only)

**Method:** `POST`  
**Endpoint:** `{{base_url}}/api/reviews`  
**Auth:** Bearer Token → `{{student_token}}`

**Body:**

```json
{
  "bookingId": "booking_uuid_here",
  "rating": 5,
  "comment": "Amazing teacher! Explained trigonometry very clearly. Highly recommended!"
}
```

**Note:** শুধুমাত্র COMPLETED status এর booking এর জন্য review দেওয়া যাবে।

---

### 5.2 Get Tutor Reviews (Public)

**Method:** `GET`  
**Endpoint:** `{{base_url}}/api/reviews/tutor/{{tutor_id}}`

**Expected Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid...",
      "rating": 5,
      "comment": "Amazing teacher!",
      "student": {
        "name": "Rahim Ahmed"
      },
      "createdAt": "2026-01-28T10:00:00Z"
    }
  ]
}
```

---

## 🔧 6. Admin APIs

### 6.1 Get All Users (Admin Only)

**Method:** `GET`  
**Endpoint:** `{{base_url}}/api/admin/users`  
**Auth:** Bearer Token → `{{admin_token}}`

**Query Parameters:**

- `role` - Filter by role (STUDENT, TUTOR)

**Example:**

```
{{base_url}}/api/admin/users?role=TUTOR
```

---

### 6.2 Get All Bookings (Admin Only)

**Method:** `GET`  
**Endpoint:** `{{base_url}}/api/admin/bookings`  
**Auth:** Bearer Token → `{{admin_token}}`

---

### 6.3 Ban User (Admin Only)

**Method:** `PATCH`  
**Endpoint:** `{{base_url}}/api/admin/users/{{user_id}}/ban`  
**Auth:** Bearer Token → `{{admin_token}}`

---

### 6.4 Unban User (Admin Only)

**Method:** `PATCH`  
**Endpoint:** `{{base_url}}/api/admin/users/{{user_id}}/unban`  
**Auth:** Bearer Token → `{{admin_token}}`

---

### 6.5 Dashboard Statistics (Admin Only)

**Method:** `GET`  
**Endpoint:** `{{base_url}}/api/admin/stats`  
**Auth:** Bearer Token → `{{admin_token}}`

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalStudents": 100,
    "totalTutors": 45,
    "totalAdmins": 5,
    "totalBookings": 500,
    "confirmedBookings": 300,
    "completedBookings": 180,
    "cancelledBookings": 20,
    "totalRevenue": 250000,
    "totalCategories": 12
  }
}
```

---

## ❌ Common Error Responses

### 400 - Validation Error (Zod)

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "path": "email",
      "message": "Invalid email address"
    },
    {
      "path": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

---

### 401 - Unauthorized (No token or invalid token)

```json
{
  "success": false,
  "message": "Unauthorized access! Please login."
}
```

---

### 403 - Forbidden (Role permission issue)

```json
{
  "success": false,
  "message": "You do not have permission to perform this action."
}
```

---

### 404 - Not Found

```json
{
  "success": false,
  "message": "Resource not found"
}
```

---

### 409 - Conflict (Duplicate entry)

```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

### 500 - Server Error

```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details..."
}
```

---

## 🧪 Testing Workflow (ধাপে ধাপে টেস্টিং)

### Phase 1: Authentication Testing

1. ✅ Register Student
2. ✅ Register Tutor
3. ✅ Login as Student (token save করো)
4. ✅ Login as Tutor (token save করো)
5. ✅ Get Me (both roles)

### Phase 2: Category Testing (Admin)

1. ✅ Login as Admin
2. ✅ Create Categories (Math, Physics, Chemistry, etc.)
3. ✅ Get All Categories (public)
4. ✅ Update Category
5. ✅ Delete Category

### Phase 3: Tutor Profile Testing

1. ✅ Login as Tutor
2. ✅ Create Tutor Profile
3. ✅ Add Availability Slots
4. ✅ Update Availability
5. ✅ Get All Tutors (public)
6. ✅ Get Single Tutor Details

### Phase 4: Booking Testing

1. ✅ Login as Student
2. ✅ Create Booking
3. ✅ Get My Bookings (student)
4. ✅ Get Booking Details
5. ✅ Login as Tutor
6. ✅ Get My Bookings (tutor)
7. ✅ Complete Booking
8. ✅ Cancel Booking (as student)

### Phase 5: Review Testing

1. ✅ Login as Student
2. ✅ Create Review (for completed booking)
3. ✅ Get Tutor Reviews (public)

### Phase 6: Admin Testing

1. ✅ Login as Admin
2. ✅ Get All Users
3. ✅ Get All Bookings
4. ✅ Ban/Unban User
5. ✅ Get Dashboard Stats

---

## 💡 Pro Tips

### 1. Collection Variables

Collection level এ এই variables set করো:

```javascript
// Pre-request Script (Collection level)
pm.request.headers.add({
  key: "Content-Type",
  value: "application/json",
});
```

### 2. Global Error Handling

Collection level Tests এ যোগ করো:

```javascript
pm.test("Response time is less than 2000ms", function () {
  pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Response has success field", function () {
  const response = pm.response.json();
  pm.expect(response).to.have.property("success");
});
```

### 3. Folder Organization

Postman Collection এ folders তৈরি করো:

```
📁 AmarShikkhok API
  📁 1. Authentication
  📁 2. Categories
  📁 3. Tutors
  📁 4. Bookings
  📁 5. Reviews
  📁 6. Admin
```

---

**Happy Testing! 🚀**

**নোট:**

- সব `uuid_here` লেখা জায়গায় actual database ID বসাবে
- Token expire হলে আবার login করো
- প্রতিটা endpoint test করার আগে সঠিক token ব্যবহার করো
- Environment variables ঠিকমতো set করা আছে কিনা check করো
