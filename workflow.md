# AmarShikkhok - সম্পূর্ণ ওয়ার্কফ্লো এবং সিস্টেম ডকুমেন্টেশন

> **Implementation Status:** ✅ Backend Complete (95%)  
> **Last Updated:** 2026-01-30  
> **Note:** এই document অনুযায়ী সব API endpoints implement করা হয়েছে এবং production-ready।

## 📋 প্রজেক্ট ওভারভিউ

**AmarShikkhok** একটি ফুল-স্ট্যাক ওয়েব অ্যাপ্লিকেশন যেখানে শিক্ষার্থীরা টিউটর খুঁজে পাবে এবং সেশন বুক করতে পারবে। টিউটররা তাদের প্রোফাইল তৈরি করবে এবং সময় সেট করবে। অ্যাডমিনরা পুরো প্ল্যাটফর্ম ম্যানেজ করবে।

---

## 🎭 Roles & Permissions (ভূমিকা এবং অনুমতি)

### 1. **Student (শিক্ষার্থী)**

**কি করতে পারবে:**

- ✅ টিউটর ব্রাউজ এবং সার্চ করতে পারবে
- ✅ টিউটর প্রোফাইল দেখতে পারবে
- ✅ সেশন বুক করতে পারবে
- ✅ বুকিং হিস্ট্রি দেখতে পারবে
- ✅ সেশনের পর রিভিউ দিতে পারবে
- ✅ নিজের প্রোফাইল আপডেট করতে পারবে

**কি করতে পারবে না:**

- ❌ টিউটর প্রোফাইল তৈরি করতে পারবে না
- ❌ অন্য ইউজার ম্যানেজ করতে পারবে না
- ❌ ক্যাটাগরি তৈরি/মুছতে পারবে না

### 2. **Tutor (শিক্ষক)**

**কি করতে পারবে:**

- ✅ টিউটর প্রোফাইল তৈরি এবং আপডেট করতে পারবে
- ✅ বিষয় (subjects) যোগ করতে পারবে
- ✅ সময়সূচী (availability) সেট করতে পারবে
- ✅ নিজের বুকিং লিস্ট দেখতে পারবে
- ✅ সেশন কমপ্লিট মার্ক করতে পারবে
- ✅ রিভিউ দেখতে পারবে
- ✅ নিজের প্রোফাইল আপডেট করতে পারবে

**কি করতে পারবে না:**

- ❌ সেশন বুক করতে পারবে না (শুধু রিসিভ করবে)
- ❌ অন্য টিউটরের প্রোফাইল এডিট করতে পারবে না
- ❌ ইউজার ব্যান/আনব্যান করতে পারবে না

### 3. **Admin (প্রশাসক)**

**কি করতে পারবে:**

- ✅ সব ইউজার দেখতে পারবে (Student + Tutor)
- ✅ ইউজার ব্যান/আনব্যান করতে পারবে
- ✅ সব বুকিং দেখতে পারবে
- ✅ ক্যাটাগরি তৈরি/আপডেট/মুছতে পারবে
- ✅ প্ল্যাটফর্ম স্ট্যাটিস্টিক্স দেখতে পারবে

**কি করতে পারবে না:**

- ❌ সরাসরি বুকিং ক্যান্সেল করতে পারবে না (শুধু দেখতে পারবে)

---

## 🗂️ Database Schema (Prisma)

### **User Table**

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String    // hashed password
  name          String
  role          Role      @default(STUDENT)
  profileImage  String?
  phone         String?
  isActive      Boolean   @default(true)
  isBanned      Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  tutorProfile  TutorProfile?
  bookings      Booking[]     @relation("StudentBookings")
  reviews       Review[]

  @@map("users")
}

enum Role {
  STUDENT
  TUTOR
  ADMIN
}
```

### **TutorProfile Table**

```prisma
model TutorProfile {
  id              String    @id @default(uuid())
  userId          String    @unique
  bio             String?   @db.Text
  expertise       String[]  // Array of subjects
  hourlyRate      Float
  experience      Int       // years of experience
  education       String?
  rating          Float     @default(0)
  totalReviews    Int       @default(0)
  totalSessions   Int       @default(0)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  user            User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  categories      Category[]
  availabilities  Availability[]
  bookings        Booking[]    @relation("TutorBookings")
  reviews         Review[]

  @@map("tutor_profiles")
}
```

### **Category Table**

```prisma
model Category {
  id          String    @id @default(uuid())
  name        String    @unique
  description String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  tutors      TutorProfile[]

  @@map("categories")
}
```

### **Availability Table**

```prisma
model Availability {
  id            String    @id @default(uuid())
  tutorId       String
  dayOfWeek     Int       // 0=Sunday, 1=Monday, ..., 6=Saturday
  startTime     String    // Format: "09:00"
  endTime       String    // Format: "17:00"
  isAvailable   Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  tutor         TutorProfile @relation(fields: [tutorId], references: [id], onDelete: Cascade)

  @@map("availabilities")
}
```

### **Booking Table**

```prisma
model Booking {
  id            String        @id @default(uuid())
  studentId     String
  tutorId       String
  subject       String
  sessionDate   DateTime
  startTime     String        // Format: "10:00"
  endTime       String        // Format: "11:00"
  status        BookingStatus @default(CONFIRMED)
  notes         String?       @db.Text
  totalPrice    Float
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  // Relations
  student       User          @relation("StudentBookings", fields: [studentId], references: [id], onDelete: Cascade)
  tutor         TutorProfile  @relation("TutorBookings", fields: [tutorId], references: [id], onDelete: Cascade)
  review        Review?

  @@map("bookings")
}

enum BookingStatus {
  CONFIRMED
  COMPLETED
  CANCELLED
}
```

### **Review Table**

```prisma
model Review {
  id          String    @id @default(uuid())
  bookingId   String    @unique
  studentId   String
  tutorId     String
  rating      Int       // 1-5
  comment     String?   @db.Text
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  booking     Booking       @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  student     User          @relation(fields: [studentId], references: [id], onDelete: Cascade)
  tutor       TutorProfile  @relation(fields: [tutorId], references: [id], onDelete: Cascade)

  @@map("reviews")
}
```

---

## 📊 Database System ব্যাখ্যা

### **সম্পর্ক (Relations):**

1. **User ↔ TutorProfile**: One-to-One
   - একজন User শুধুমাত্র একটি TutorProfile তৈরি করতে পারবে
   - TutorProfile ছাড়াই User থাকতে পারে (যদি সে Student হয়)

2. **TutorProfile ↔ Category**: Many-to-Many
   - একজন Tutor অনেক Category তে পড়াতে পারবে
   - একটি Category তে অনেক Tutor থাকতে পারবে

3. **TutorProfile ↔ Availability**: One-to-Many
   - একজন Tutor এর অনেক Availability slot থাকতে পারবে

4. **User ↔ Booking**: One-to-Many (Student হিসেবে)
   - একজন Student অনেক Booking করতে পারবে

5. **TutorProfile ↔ Booking**: One-to-Many
   - একজন Tutor অনেক Booking রিসিভ করতে পারবে

6. **Booking ↔ Review**: One-to-One
   - একটি Booking এর জন্য শুধুমাত্র একটি Review দেওয়া যাবে

---

## 📁 Folder & File Structure

```
Backend/
│
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data (admin, categories)
│
├── src/
│   ├── config/
│   │   ├── database.ts        # Prisma client instance
│   │   └── env.ts             # Environment variables
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts      # JWT verification
│   │   ├── role.middleware.ts      # Role-based access control
│   │   ├── error.middleware.ts     # Global error handler
│   │   └── validate.middleware.ts  # Request validation
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.validation.ts
│   │   │   └── auth.interface.ts
│   │   │
│   │   ├── user/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.route.ts
│   │   │   ├── user.validation.ts
│   │   │   └── user.interface.ts
│   │   │
│   │   ├── tutor/
│   │   │   ├── tutor.controller.ts
│   │   │   ├── tutor.service.ts
│   │   │   ├── tutor.route.ts
│   │   │   ├── tutor.validation.ts
│   │   │   └── tutor.interface.ts
│   │   │
│   │   ├── category/
│   │   │   ├── category.controller.ts
│   │   │   ├── category.service.ts
│   │   │   ├── category.route.ts
│   │   │   ├── category.validation.ts
│   │   │   └── category.interface.ts
│   │   │
│   │   ├── booking/
│   │   │   ├── booking.controller.ts
│   │   │   ├── booking.service.ts
│   │   │   ├── booking.route.ts
│   │   │   ├── booking.validation.ts
│   │   │   └── booking.interface.ts
│   │   │
│   │   ├── review/
│   │   │   ├── review.controller.ts
│   │   │   ├── review.service.ts
│   │   │   ├── review.route.ts
│   │   │   ├── review.validation.ts
│   │   │   └── review.interface.ts
│   │   │
│   │   └── admin/
│   │       ├── admin.controller.ts
│   │       ├── admin.service.ts
│   │       ├── admin.route.ts
│   │       ├── admin.validation.ts
│   │       └── admin.interface.ts
│   │
│   ├── utils/
│   │   ├── bcrypt.ts          # Password hashing
│   │   ├── jwt.ts             # JWT token generation/verification
│   │   ├── response.ts        # Standard API response
│   │   └── asyncHandler.ts    # Async error wrapper
│   │
│   ├── types/
│   │   ├── express.d.ts       # Express type extensions
│   │   └── common.ts          # Common types
│   │
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
│
├── .env                       # Environment variables
├── .env.example               # Example env file
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔐 API Endpoints বিস্তারিত

### **1. Authentication APIs (Better Auth)**

#### `POST /api/auth/sign-up/email`

**কাজ:** নতুন ইউজার রেজিস্টার করা  
**Headers:** `Content-Type: application/json`  
**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "STUDENT", // or "TUTOR" or "ADMIN"
  "phone": "01700000000"
}
```

**Response (200):**

```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "isActive": true,
    "isBanned": false,
    "createdAt": "2026-01-30T10:00:00Z"
  },
  "session": {
    "token": "jwt_token_here",
    "expiresAt": "2026-02-06T10:00:00Z"
  }
}
```

#### `POST /api/auth/sign-in/email`

**কাজ:** ইউজার লগইন করা  
**Headers:** `Content-Type: application/json`  
**Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT"
  },
  "session": {
    "token": "jwt_token_here"
  }
}
```

#### `POST /api/auth/sign-out`

**কাজ:** ইউজার লগআউট করা  
**Headers:** `Authorization: Bearer <token>`

---

### **2. User APIs (Private)**

#### `GET /api/users/me`

**কাজ:** বর্তমান লগইন ইউজারের প্রোফাইল দেখা  
**Headers:** `Authorization: Bearer <token>`  
**Response (200):**

```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "phone": "01700000000",
    "image": "https://...",
    "isActive": true,
    "isBanned": false,
    "createdAt": "2026-01-30T10:00:00Z"
  }
}
```

#### `PUT /api/users/profile`

**কাজ:** ইউজার প্রোফাইল আপডেট করা  
**Headers:** `Authorization: Bearer <token>`  
**Body:**

```json
{
  "name": "John Updated",
  "phone": "01800000000",
  "image": "https://..."
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "User profile updated successfully",
  "data": {
    "id": "uuid",
    "name": "John Updated",
    "email": "john@example.com",
    "phone": "01800000000",
    "image": "https://..."
  }
}
```

---

### **3. Tutor APIs (Public)**

#### `GET /api/tutors`

**কাজ:** সব টিউটর লিস্ট পাওয়া (ফিল্টার সহ)  
**Query Parameters:**

- `search` - নাম/ইমেইল/ID দিয়ে সার্চ
- `category` - ক্যাটাগরি ID দিয়ে ফিল্টার
- `minPrice` - মিনিমাম hourly rate
- `maxPrice` - ম্যাক্সিমাম hourly rate
- `rating` - মিনিমাম রেটিং (1-5)

**Example:** `/api/tutors?category=uuid&minPrice=500&maxPrice=2000&rating=4`

**Response (200):**

```json
{
  "success": true,
  "message": "Tutors fetched successfully",
  "data": [
    {
      "id": "tutor_uuid",
      "userId": "user_uuid",
      "user": {
        "name": "Dr. Ahmed",
        "email": "ahmed@example.com",
        "image": "https://..."
      },
      "bio": "Experienced Mathematics tutor",
      "expertise": ["Calculus", "Algebra"],
      "hourlyRate": 1200,
      "experience": 5,
      "education": "PhD in Mathematics",
      "rating": 4.8,
      "totalReviews": 45,
      "totalSessions": 120,
      "categories": [
        {
          "id": "cat_uuid",
          "name": "Mathematics"
        }
      ],
      "availability": [
        {
          "dayOfWeek": 1,
          "startTime": "09:00",
          "endTime": "17:00",
          "isAvailable": true
        }
      ]
    }
  ]
}
```

#### `GET /api/tutors/:id`

**কাজ:** একজন টিউটরের বিস্তারিত তথ্য  
**Response (200):**

```json
{
  "success": true,
  "message": "Tutor fetched successfully",
  "data": {
    "id": "tutor_uuid",
    "user": {
      "name": "Dr. Ahmed",
      "email": "ahmed@example.com",
      "image": "https://..."
    },
    "bio": "Experienced Mathematics tutor",
    "expertise": ["Calculus", "Algebra"],
    "hourlyRate": 1200,
    "experience": 5,
    "education": "PhD in Mathematics",
    "rating": 4.8,
    "totalReviews": 45,
    "totalSessions": 120,
    "categories": [...],
    "availability": [...],
    "reviews": [
      {
        "id": "review_uuid",
        "rating": 5,
        "comment": "Excellent tutor!",
        "student": {
          "name": "John Doe"
        },
        "createdAt": "2026-01-25T10:00:00Z"
      }
    ]
  }
}
```

---

### **4. Tutor Management APIs (Private - Tutor Only)**

#### `PUT /api/tutor/profile`

**কাজ:** টিউটর প্রোফাইল তৈরি/আপডেট করা  
**Headers:** `Authorization: Bearer <token>`  
**Body:**

```json
{
  "bio": "Experienced Math tutor with 5 years experience",
  "expertise": ["Calculus", "Algebra", "Statistics"],
  "hourlyRate": 1200,
  "experience": 5,
  "education": "MSc in Mathematics",
  "categoryIds": ["cat_uuid_1", "cat_uuid_2"]
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Tutor created successfully",
  "data": {
    "id": "tutor_uuid",
    "userId": "user_uuid",
    "bio": "Experienced Math tutor...",
    "expertise": ["Calculus", "Algebra", "Statistics"],
    "hourlyRate": 1200,
    "experience": 5,
    "education": "MSc in Mathematics",
    "rating": 0,
    "totalReviews": 0,
    "totalSessions": 0
  }
}
```

#### `POST /api/tutor/availability`

**কাজ:** নতুন সময়সূচী যোগ করা  
**Headers:** `Authorization: Bearer <token>`  
**Body:**

```json
{
  "dayOfWeek": 1, // 0=Sunday, 1=Monday, ..., 6=Saturday
  "startTime": "09:00",
  "endTime": "17:00"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Availability added successfully",
  "data": {
    "id": "avail_uuid",
    "tutorId": "tutor_uuid",
    "dayOfWeek": 1,
    "startTime": "09:00",
    "endTime": "17:00",
    "isAvailable": true
  }
}
```

#### `PUT /api/tutor/availability`

**কাজ:** বিদ্যমান সময়সূচী আপডেট করা  
**Headers:** `Authorization: Bearer <token>`  
**Body:**

```json
{
  "dayOfWeek": 1,
  "startTime": "10:00",
  "endTime": "18:00",
  "isAvailable": true
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Availability updated successfully",
  "data": {
    "id": "avail_uuid",
    "dayOfWeek": 1,
    "startTime": "10:00",
    "endTime": "18:00",
    "isAvailable": true
  }
}
```

#### `GET /api/tutor/bookings`

**কাজ:** টিউটরের সব বুকিং দেখা  
**Headers:** `Authorization: Bearer <token>`  
**Query:** `?status=CONFIRMED` (optional: CONFIRMED, COMPLETED, CANCELLED)

**Response (200):**

```json
{
  "success": true,
  "message": "Bookings fetched successfully",
  "data": [
    {
      "id": "booking_uuid",
      "studentId": "student_uuid",
      "student": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "subject": "Mathematics",
      "sessionDate": "2026-02-01T00:00:00Z",
      "startTime": "10:00",
      "endTime": "11:00",
      "status": "CONFIRMED",
      "totalPrice": 1200,
      "notes": "Need help with calculus",
      "createdAt": "2026-01-30T10:00:00Z"
    }
  ]
}
```

---

### **5. Booking APIs**

#### `POST /api/bookings`

**কাজ:** নতুন বুকিং তৈরি করা (Student Only)  
**Headers:** `Authorization: Bearer <token>`  
**Body:**

```json
{
  "tutorId": "tutor_uuid",
  "subject": "Mathematics",
  "sessionDate": "2026-02-01T00:00:00Z",
  "startTime": "10:00",
  "endTime": "11:00",
  "notes": "Need help with calculus"
}
```

**Validations:**

- ✅ Tutor must exist
- ✅ Session date must be in future
- ✅ Tutor must be available on that day/time
- ✅ No duplicate booking (same student, tutor, date, time)
- ✅ Auto-calculates price based on hourly rate and duration

**Response (201):**

```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "booking_uuid",
    "studentId": "student_uuid",
    "tutorId": "tutor_uuid",
    "subject": "Mathematics",
    "sessionDate": "2026-02-01T00:00:00Z",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "CONFIRMED",
    "totalPrice": 1200,
    "notes": "Need help with calculus",
    "createdAt": "2026-01-30T10:00:00Z"
  }
}
```

#### `GET /api/bookings`

**কাজ:** ইউজারের সব বুকিং দেখা (Student: তার bookings, Tutor: তার received bookings)  
**Headers:** `Authorization: Bearer <token>`  
**Query:** `?status=CONFIRMED` (optional)

**Response (200):**

```json
{
  "success": true,
  "message": "Bookings retrieved successfully",
  "data": [
    {
      "id": "booking_uuid",
      "tutorId": "tutor_uuid",
      "tutor": {
        "id": "tutor_uuid",
        "user": {
          "name": "Dr. Ahmed",
          "image": "https://..."
        },
        "hourlyRate": 1200
      },
      "subject": "Mathematics",
      "sessionDate": "2026-02-01T00:00:00Z",
      "startTime": "10:00",
      "endTime": "11:00",
      "status": "CONFIRMED",
      "totalPrice": 1200
    }
  ]
}
```

#### `GET /api/bookings/:id`

**কাজ:** একটি নির্দিষ্ট বুকিং এর বিস্তারিত তথ্য দেখা  
**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "message": "Booking retrieved successfully",
  "data": {
    "id": "booking_uuid",
    "student": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "tutor": {
      "id": "tutor_uuid",
      "name": "Dr. Ahmed",
      "image": "https://...",
      "hourlyRate": 1200
    },
    "subject": "Mathematics",
    "sessionDate": "2026-02-01T00:00:00Z",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "CONFIRMED",
    "totalPrice": 1200,
    "notes": "Need help with calculus",
    "createdAt": "2026-01-30T10:00:00Z"
  }
}
```

#### `PATCH /api/bookings/:id/complete`

**কাজ:** বুকিং কমপ্লিট মার্ক করা (Tutor Only)  
**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "message": "Booking completed successfully",
  "data": {
    "id": "booking_uuid",
    "status": "COMPLETED",
    "updatedAt": "2026-02-01T12:00:00Z"
  }
}
```

#### `PATCH /api/bookings/:id/cancel`

**কাজ:** বুকিং ক্যান্সেল করা (Student Only)  
**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "id": "booking_uuid",
    "status": "CANCELLED",
    "updatedAt": "2026-01-31T10:00:00Z"
  }
}
```

---

### **6. Review APIs**

#### `POST /api/reviews`

**কাজ:** রিভিউ দেওয়া (Student Only, শুধু COMPLETED booking এর জন্য)  
**Headers:** `Authorization: Bearer <token>`  
**Body:**

```json
{
  "bookingId": "booking_uuid",
  "rating": 5, // 1-5
  "comment": "Excellent tutor! Very helpful and patient."
}
```

**Validations:**

- ✅ Booking must exist and belong to student
- ✅ Booking status must be COMPLETED
- ✅ No duplicate review for same booking

**Response (201):**

```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": "review_uuid",
    "bookingId": "booking_uuid",
    "studentId": "student_uuid",
    "tutorId": "tutor_uuid",
    "rating": 5,
    "comment": "Excellent tutor! Very helpful and patient.",
    "createdAt": "2026-02-02T10:00:00Z"
  }
}
```

**Note:** টিউটরের rating এবং totalReviews automatically update হবে।

#### `GET /api/reviews/tutor/:tutorId`

**কাজ:** একজন টিউটরের সব রিভিউ দেখা (Public)

**Response (200):**

```json
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": [
    {
      "id": "review_uuid",
      "rating": 5,
      "comment": "Excellent tutor!",
      "student": {
        "name": "John Doe",
        "image": "https://..."
      },
      "createdAt": "2026-02-02T10:00:00Z"
    }
  ]
}
```

---

### **7. Category APIs**

#### `GET /api/categories`

**কাজ:** সব ক্যাটাগরি লিস্ট পাওয়া (Public)

**Response (201):**

```json
{
  "success": true,
  "message": "Retrieved all categories successfully",
  "data": [
    {
      "id": "cat_uuid",
      "name": "Mathematics",
      "description": "Math tutoring services",
      "tutors": [
        {
          "id": "tutor_uuid",
          "user": {
            "name": "Dr. Ahmed"
          },
          "hourlyRate": 1200,
          "rating": 4.8
        }
      ],
      "createdAt": "2026-01-20T10:00:00Z"
    }
  ]
}
```

#### `POST /api/categories`

**কাজ:** নতুন ক্যাটাগরি তৈরি করা (Admin Only)  
**Headers:** `Authorization: Bearer <token>`  
**Body:**

```json
{
  "name": "Mathematics",
  "description": "Math tutoring services"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "cat_uuid",
    "name": "Mathematics",
    "description": "Math tutoring services",
    "createdAt": "2026-01-30T10:00:00Z"
  }
}
```

#### `PUT /api/categories/:id`

**কাজ:** ক্যাটাগরি আপডেট করা (Admin Only)  
**Headers:** `Authorization: Bearer <token>`  
**Body:**

```json
{
  "name": "Advanced Mathematics",
  "description": "Advanced math tutoring"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": "cat_uuid",
    "name": "Advanced Mathematics",
    "description": "Advanced math tutoring",
    "updatedAt": "2026-01-30T11:00:00Z"
  }
}
```

#### `DELETE /api/categories/:id`

**কাজ:** ক্যাটাগরি মুছে ফেলা (Admin Only)  
**Headers:** `Authorization: Bearer <token>`

**Response (201):**

```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": {
    "id": "cat_uuid"
  }
}
```

---

### **8. Admin APIs (Admin Only)**

#### `GET /api/admin/users`

**কাজ:** সব ইউজার দেখা (Admin Only)  
**Headers:** `Authorization: Bearer <token>`  
**Query:** `?role=STUDENT` or `?role=TUTOR` (optional)

**Response (200):**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "user_uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "STUDENT",
      "phone": "01700000000",
      "isActive": true,
      "isBanned": false,
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ]
}
```

#### `PATCH /api/admin/users/:userId/ban`

**কাজ:** ইউজার ব্যান করা (Admin Only)  
**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "message": "User banned successfully",
  "data": {
    "id": "user_uuid",
    "isBanned": true,
    "updatedAt": "2026-01-30T10:00:00Z"
  }
}
```

#### `PATCH /api/admin/users/:userId/unban`

**কাজ:** ইউজার আনব্যান করা (Admin Only)  
**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "message": "User unbanned successfully",
  "data": {
    "id": "user_uuid",
    "isBanned": false,
    "updatedAt": "2026-01-30T10:00:00Z"
  }
}
```

#### `GET /api/admin/bookings`

**কাজ:** সব বুকিং দেখা (Admin Only)  
**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "message": "Bookings retrieved successfully",
  "data": [
    {
      "id": "booking_uuid",
      "student": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "tutor": {
        "id": "tutor_uuid",
        "user": {
          "name": "Dr. Ahmed",
          "email": "ahmed@example.com"
        },
        "hourlyRate": 1200
      },
      "subject": "Mathematics",
      "sessionDate": "2026-02-01T00:00:00Z",
      "startTime": "10:00",
      "endTime": "11:00",
      "status": "CONFIRMED",
      "totalPrice": 1200,
      "createdAt": "2026-01-30T10:00:00Z"
    }
  ]
}
```

#### `GET /api/admin/stats`

**কাজ:** প্ল্যাটফর্ম ড্যাশবোর্ড স্ট্যাটিস্টিক্স (Admin Only)  
**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "totalUsers": 150,
    "totalStudents": 100,
    "totalTutors": 45,
    "totalAdmins": 5,
    "totalTutorProfiles": 40,
    "availableTutors": 35,
    "totalBookings": 500,
    "confirmedBookings": 200,
    "completedBookings": 250,
    "cancelledBookings": 50,
    "totalReviews": 180,
    "totalRevenue": 600000
  }
}
```

---

### **9. Error Responses (সব endpoints এর জন্য)**

#### Validation Error (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "statusCode": 400,
  "error": {
    "type": "ValidationError",
    "errors": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

#### Unauthorized (401)

```json
{
  "success": false,
  "message": "User not authenticated",
  "statusCode": 401
}
```

#### Forbidden (403)

```json
{
  "success": false,
  "message": "Access denied. Admin role required.",
  "statusCode": 403
}
```

#### Not Found (404)

```json
{
  "success": false,
  "message": "Record not found",
  "statusCode": 404,
  "error": {
    "code": "P2025"
  }
}
```

#### Duplicate Entry (400)

```json
{
  "success": false,
  "message": "Duplicate value for email. This value already exists.",
  "statusCode": 400,
  "error": {
    "code": "P2002",
    "field": ["email"]
  }
}
```

#### Server Error (500)

```json
{
  "success": false,
  "message": "Internal server error",
  "statusCode": 500
}
```

---

## 🚀 Development Workflow (ধাপে ধাপে কাজের প্রসেস)

### **Phase 1: প্রজেক্ট সেটআপ (১-২ দিন)**

#### Step 1: প্রজেক্ট ইনিশিয়ালাইজ করা

```bash
# Backend ফোল্ডারে যাও
cd Backend

# Dependencies ইনস্টল করা (যদি না করা থাকে)
npm install

# Environment variables সেটআপ
# .env ফাইল তৈরি করো এবং এগুলো যোগ করো:
DATABASE_URL="postgresql://user:password@localhost:5432/amarshikkhok"
JWT_SECRET="your_super_secret_key_here"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
```

#### Step 2: Prisma সেটআপ

```bash
# Prisma schema তৈরি করো (উপরের schema কপি করো)
# prisma/schema.prisma ফাইলে

# Database migrate করো
npx prisma migrate dev --name init

# Prisma Client generate করো
npx prisma generate

# Prisma Studio দিয়ে database দেখো
npx prisma studio
```

#### Step 3: Seed Data তৈরি করো

```bash
# prisma/seed.ts ফাইল তৈরি করো
# Admin user এবং কিছু categories যোগ করো

# Seed run করো
npx prisma db seed
```

---

### **Phase 2: Authentication System (২-৩ দিন)**

#### Step 1: Utils তৈরি করো

1. `src/utils/bcrypt.ts` - Password hashing
2. `src/utils/jwt.ts` - Token generation/verification
3. `src/utils/response.ts` - Standard response format
4. `src/utils/asyncHandler.ts` - Error handling wrapper

#### Step 2: Auth Module তৈরি করো

1. `src/modules/auth/auth.interface.ts` - Types define করো
2. `src/modules/auth/auth.validation.ts` - Zod validation schema
3. `src/modules/auth/auth.service.ts` - Business logic (register, login)
4. `src/modules/auth/auth.controller.ts` - Request handlers
5. `src/modules/auth/auth.route.ts` - Routes define করো

#### Step 3: Middleware তৈরি করো

1. `src/middlewares/auth.middleware.ts` - JWT verify করো
2. `src/middlewares/role.middleware.ts` - Role check করো
3. `src/middlewares/error.middleware.ts` - Global error handler

#### Step 4: Test করো

- Postman/Thunder Client দিয়ে register/login test করো
- Token verify হচ্ছে কিনা check করো

---

### **Phase 3: User & Tutor Module (৩-৪ দিন)**

#### Step 1: User Module

1. User profile দেখা
2. User profile আপডেট করা
3. Password change করা

#### Step 2: Tutor Module

1. Tutor profile তৈরি করা
2. Tutor profile আপডেট করা
3. Availability সেট করা
4. Public tutor list API
5. Single tutor details API
6. Search & Filter implement করো

#### Step 3: Category Module

1. Category CRUD operations (Admin only)
2. Public category list

---

### **Phase 4: Booking System (৩-৪ দিন)**

#### Step 1: Booking Module তৈরি করো

1. Create booking (Student only)
2. Get user bookings (Student/Tutor)
3. Complete booking (Tutor only)
4. Cancel booking (Student only)

#### Step 2: Validation যোগ করো

- Session date ভবিষ্যতে আছে কিনা
- Tutor available আছে কিনা সেই সময়ে
- Duplicate booking নেই কিনা

#### Step 3: Price Calculation

- Tutor এর hourly rate অনুযায়ী total price calculate করো

---

### **Phase 5: Review System (২ দিন)**

#### Step 1: Review Module

1. Create review (শুধু completed booking এর জন্য)
2. Get tutor reviews
3. Prevent duplicate review

#### Step 2: Rating Update

- Review দেওয়ার পর tutor এর average rating আপডেট করো
- Total reviews count বাড়াও

---

### **Phase 6: Admin Panel (২-৩ দিন)**

#### Step 1: User Management

1. Get all users (with filters)
2. Ban/Unban users
3. View user details

#### Step 2: Booking Management

1. View all bookings
2. View booking statistics

#### Step 3: Dashboard Stats

1. Total users, students, tutors
2. Total bookings
3. Revenue calculation

---

### **Phase 7: Testing & Refinement (২-৩ দিন)**

#### Step 1: API Testing

- সব endpoints Postman দিয়ে test করো
- Edge cases test করো
- Error handling check করো

#### Step 2: Security Check

- JWT properly working
- Role-based access control
- Password hashing
- SQL injection prevention (Prisma automatically করে)

#### Step 3: Code Cleanup

- Unused code remove করো
- Comments যোগ করো
- Code formatting করো

---

## 🔒 Security Best Practices

1. **Password Hashing:** bcrypt ব্যবহার করো (salt rounds: 10)
2. **JWT Secret:** Strong secret key ব্যবহার করো
3. **Environment Variables:** Sensitive data .env তে রাখো
4. **Validation:** সব input validate করো (Zod ব্যবহার করো)
5. **Error Messages:** Sensitive information expose করো না
6. **Rate Limiting:** (Optional) Too many requests prevent করো

---

## 📝 Coding Standards

### **File Naming:**

- `kebab-case.ts` for files
- `PascalCase` for interfaces/types
- `camelCase` for functions/variables

### **Code Structure:**

```typescript
// 1. Imports
import { Request, Response } from "express";

// 2. Interfaces/Types
interface LoginData {
  email: string;
  password: string;
}

// 3. Main function
export const login = async (req: Request, res: Response) => {
  // Logic here
};
```

### **Error Handling:**

```typescript
try {
  // Your code
} catch (error) {
  throw new Error("Meaningful error message");
}
```

### **Response Format:**

```typescript
// Success
res.status(200).json({
  success: true,
  message: "Operation successful",
  data: result,
});

// Error
res.status(400).json({
  success: false,
  message: "Error message",
  error: errorDetails,
});
```

---

## 🧪 Testing Checklist

### **Authentication:**

- [ ] Register করা যাচ্ছে কিনা
- [ ] Login করা যাচ্ছে কিনা
- [ ] Token generate হচ্ছে কিনা
- [ ] Invalid credentials reject হচ্ছে কিনা
- [ ] Duplicate email prevent হচ্ছে কিনা

### **Authorization:**

- [ ] Student শুধু student routes access করতে পারছে
- [ ] Tutor শুধু tutor routes access করতে পারছে
- [ ] Admin সব routes access করতে পারছে
- [ ] Unauthorized access block হচ্ছে

### **Tutor Module:**

- [ ] Tutor list পাওয়া যাচ্ছে
- [ ] Filter/Search কাজ করছে
- [ ] Tutor profile create/update হচ্ছে
- [ ] Availability সেট করা যাচ্ছে

### **Booking Module:**

- [ ] Booking তৈরি হচ্ছে
- [ ] Price correctly calculate হচ্ছে
- [ ] Status update হচ্ছে
- [ ] Duplicate booking prevent হচ্ছে

### **Review Module:**

- [ ] Review দেওয়া যাচ্ছে
- [ ] Rating update হচ্ছে
- [ ] Duplicate review prevent হচ্ছে

---

## 🎯 Important Notes

### **যখন তুমি কোড করবে:**

1. একটা module শেষ করে তারপর অন্যটা শুরু করো
2. প্রতিটা API test করে নাও তৈরি করার পর
3. Git commit করো প্রতিটা feature শেষে
4. Error handling ভুলে যেও না
5. Validation সব জায়গায় করো

### **যদি আটকে যাও:**

1. Error message ভালো করে পড়ো
2. Prisma schema check করো
3. Database তে data আছে কিনা দেখো (Prisma Studio)
4. Console.log করে debug করো
5. আমাকে জিজ্ঞেস করো specific error সহ

### **Common Mistakes এড়াও:**

- ❌ Password plain text save করা
- ❌ JWT secret hard-code করা
- ❌ Validation skip করা
- ❌ Error handling না করা
- ❌ Relations ভুল define করা

---

## 📚 Useful Commands

```bash
# Development server চালু করো
npm run dev

# Prisma Studio খোলো
npm run studio

# Database reset করো (সাবধান!)
npx prisma migrate reset

# New migration তৈরি করো
npx prisma migrate dev --name migration_name

# Production build
npm run build

# Production server চালু করো
npm start
```

---

## 🎓 Learning Resources

যদি কোনো concept বুঝতে সমস্যা হয়:

- **Prisma Docs:** https://www.prisma.io/docs
- **Express.js:** https://expressjs.com
- **JWT:** https://jwt.io
- **Zod Validation:** https://zod.dev

---

## ✅ Final Checklist (Submit করার আগে)

- [ ] সব API endpoints কাজ করছে
- [ ] Authentication/Authorization properly implement করা
- [ ] Database relations সঠিক
- [ ] Error handling সব জায়গায় আছে
- [ ] Code clean এবং organized
- [ ] README.md আপডেট করা
- [ ] .env.example ফাইল তৈরি করা
- [ ] Git এ সব commit করা
- [ ] Postman collection তৈরি করা (optional but helpful)

---

**শুভকামনা! তুমি পারবে! 🚀**

যেকোনো সমস্যা হলে আমাকে জানাও। আমি তোমাকে guide করবো।
