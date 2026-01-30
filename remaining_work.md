# 🎯 AmarShikkhok Backend - বাকি কাজের বিস্তারিত গাইড

## 📊 সারসংক্ষেপ

তোমার backend application এর **বর্তমান অবস্থা প্রায় 35-40% সম্পূর্ণ**। Database schema এবং authentication system ভালো আছে, কিন্তু বেশিরভাগ business logic এবং API endpoints এখনো implement করা হয়নি।

---

## ✅ যা ঠিক আছে (Already Completed)

1. ✅ **Database Schema** - Prisma schema সম্পূর্ণ এবং সঠিক
2. ✅ **Authentication** - Better Auth integration করা হয়েছে
3. ✅ **Category Module** - সম্পূর্ণ CRUD operations
4. ✅ **Project Structure** - Folder organization ভালো
5. ✅ **Basic Tutor APIs** - Get tutors, get single tutor
6. ✅ **Basic Booking APIs** - Create, get booking

---

## ❌ যা বাকি আছে (Missing Features)

### 🔴 Critical (অবশ্যই করতে হবে)

#### 1. **User Module** (সম্পূর্ণ missing)

- **Location**: `src/modules/user/`
- **Files to implement**:
  - `user.service.ts` - খালি আছে
  - `user.controller.ts` - খালি আছে
  - `user.route.ts` - খালি আছে
  - `user.validation.ts` - নতুন তৈরি করতে হবে

**করতে হবে**:

```typescript
// user.service.ts
- getUserProfile(userId) - ইউজার প্রোফাইল দেখা
- updateUserProfile(userId, data) - প্রোফাইল আপডেট
- changePassword(userId, oldPassword, newPassword) - পাসওয়ার্ড পরিবর্তন

// user.controller.ts
- getMe - বর্তমান লগইন ইউজারের তথ্য
- updateProfile - প্রোফাইল আপডেট
- changePassword - পাসওয়ার্ড পরিবর্তন

// user.route.ts
GET /api/users/me - নিজের প্রোফাইল দেখা
PUT /api/users/profile - প্রোফাইল আপডেট
PUT /api/users/password - পাসওয়ার্ড পরিবর্তন
```

**app.ts তে add করতে হবে**:

```typescript
import { UserRouter } from "./modules/user/user.route";
app.use("/api/users", UserRouter);
```

---

#### 2. **Review Module** (সম্পূর্ণ missing)

- **Location**: `src/modules/review/`
- **Files to implement**:
  - `review.service.ts` - খালি আছে
  - `review.controller.ts` - skeleton only
  - `review.route.ts` - skeleton only
  - `review.validation.ts` - নতুন তৈরি করতে হবে

**করতে হবে**:

```typescript
// review.service.ts
- createReview(studentId, bookingId, rating, comment)
  * Check: booking COMPLETED status কিনা
  * Check: student এর booking কিনা
  * Check: আগে review দেওয়া হয়েছে কিনা (duplicate prevent)
  * Create review
  * Update tutor এর average rating এবং totalReviews

- getTutorReviews(tutorId) - টিউটরের সব reviews

// review.controller.ts
- createReview - Review তৈরি (Student only)
- getTutorReviews - টিউটরের reviews দেখা (Public)

// review.route.ts
POST /api/reviews - Review তৈরি (Student only)
GET /api/reviews/tutor/:tutorId - টিউটরের reviews (Public)
```

**app.ts তে add করতে হবে**:

```typescript
import { ReviewRouter } from "./modules/review/review.route";
app.use("/api/reviews", ReviewRouter);
```

**Important Logic**:

```typescript
// Review দেওয়ার পর tutor এর rating update করতে হবে
const reviews = await prisma.review.findMany({
  where: { tutorId },
  select: { rating: true },
});

const avgRating =
  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

await prisma.tutorProfile.update({
  where: { id: tutorId },
  data: {
    rating: avgRating,
    totalReviews: reviews.length,
  },
});
```

---

#### 3. **Admin Module** (সম্পূর্ণ missing)

- **Location**: `src/modules/admin/`
- **Files to implement**:
  - `admin.service.ts` - খালি আছে
  - `admin.controller.ts` - খালি আছে
  - `admin.route.ts` - খালি আছে
  - `admin.validation.ts` - নতুন তৈরি করতে হবে

**করতে হবে**:

```typescript
// admin.service.ts
- getAllUsers(role?) - সব ইউজার (filter by role)
- banUser(userId) - ইউজার ban করা
- unbanUser(userId) - ইউজার unban করা
- getAllBookings() - সব bookings
- getDashboardStats() - Statistics:
  * totalUsers, totalStudents, totalTutors, totalAdmins
  * totalBookings (by status)
  * totalRevenue (sum of all COMPLETED bookings)
  * totalCategories

// admin.controller.ts
- getAllUsers
- banUser
- unbanUser
- getAllBookings
- getDashboardStats

// admin.route.ts
GET /api/admin/users - সব ইউজার (Admin only)
PATCH /api/admin/users/:id/ban - Ban user (Admin only)
PATCH /api/admin/users/:id/unban - Unban user (Admin only)
GET /api/admin/bookings - সব bookings (Admin only)
GET /api/admin/stats - Dashboard stats (Admin only)
```

**app.ts তে add করতে হবে**:

```typescript
import { AdminRouter } from "./modules/admin/admin.route";
app.use("/api/admin", AdminRouter);
```

---

### 🟡 Important (করা উচিত)

#### 4. **Tutor Module Completion**

- **Location**: `src/modules/tutor/`
- **Files to update**:
  - `tutor.service.ts` - নতুন functions যোগ করতে হবে
  - `tutor.controller.ts` - নতুন controllers যোগ করতে হবে
  - `tutor.route.ts` - নতুন routes যোগ করতে হবে
  - `tutor.validation.ts` - নতুন তৈরি করতে হবে

**যা বাকি আছে**:

```typescript
// tutor.service.ts তে যোগ করতে হবে
- createOrUpdateTutorProfile(userId, data)
  * Check: user TUTOR role আছে কিনা
  * Create or update TutorProfile
  * Connect categories

- addAvailability(tutorId, dayOfWeek, startTime, endTime)
  * Create availability slot

- updateAvailability(tutorId, dayOfWeek, data)
  * Update existing availability

- getTutorBookings(tutorId, status?)
  * Get tutor এর সব bookings (with filter)

// tutor.controller.ts তে যোগ করতে হবে
- updateProfile
- addAvailability
- updateAvailability
- getMyBookings

// tutor.route.ts তে যোগ করতে হবে
PUT /api/tutor/profile - Profile update (Tutor only)
POST /api/tutor/availability - Add availability (Tutor only)
PUT /api/tutor/availability - Update availability (Tutor only)
GET /api/tutor/bookings - Get bookings (Tutor only)
```

---

#### 5. **Booking Module Completion** 

- **Location**: `src/modules/booking/`
- **Files to update**:
  - `booking.service.ts` - functions update করতে হবে
  - `booking.controller.ts` - নতুন controllers যোগ করতে হবে
  - `booking.route.ts` - নতুন routes যোগ করতে হবে
  - `booking.validation.ts` - নতুন তৈরি করতে হবে

**যা বাকি আছে**:

```typescript
// booking.service.ts তে update করতে হবে
- createBooking(studentId, data) - Validations যোগ করতে হবে:
  * Check: tutor exists
  * Check: sessionDate ভবিষ্যতে আছে কিনা
  * Check: tutor available আছে কিনা সেই সময়ে
  * Check: duplicate booking নেই কিনা
  * Calculate totalPrice (hourlyRate × hours)

- getUserBookings(userId, role, status?) - Role অনুযায়ী bookings
  * যদি STUDENT হয়: studentId = userId
  * যদি TUTOR হয়: tutorId = userId (TutorProfile থেকে নিতে হবে)

- completeBooking(bookingId, tutorId)
  * Check: tutor এর booking কিনা
  * Check: status CONFIRMED কিনা
  * Update status to COMPLETED
  * Update tutor এর totalSessions

- cancelBooking(bookingId, studentId)
  * Check: student এর booking কিনা
  * Check: status CONFIRMED কিনা
  * Update status to CANCELLED

// booking.controller.ts তে যোগ করতে হবে
- getMyBookings (role-based)
- completeBooking (Tutor only)
- cancelBooking (Student only)

// booking.route.ts তে যোগ করতে হবে
GET /api/bookings - Get user's bookings (auth required)
PATCH /api/bookings/:id/complete - Complete (Tutor only)
PATCH /api/bookings/:id/cancel - Cancel (Student only)
```

**Important Validation Logic**:

```typescript
// Check tutor availability
const availability = await prisma.availability.findFirst({
  where: {
    tutorId,
    dayOfWeek: new Date(sessionDate).getDay(),
    isAvailable: true,
    startTime: { lte: startTime },
    endTime: { gte: endTime },
  },
});

if (!availability) {
  throw new Error("Tutor is not available at this time");
}

// Calculate total price
const tutor = await prisma.tutorProfile.findUnique({
  where: { id: tutorId },
});

const [startHour, startMin] = startTime.split(":").map(Number);
const [endHour, endMin] = endTime.split(":").map(Number);
const hours = endHour - startHour + (endMin - startMin) / 60;
const totalPrice = tutor.hourlyRate * hours;
```

---

### 🟢 Nice to Have (optional কিন্তু recommended)

#### 6. **Middlewares**

- **Location**: `src/middlewares/`

**নতুন files তৈরি করতে হবে**:

**`role.ts`** - Role-based access control:

```typescript
import { Request, Response, NextFunction } from "express";

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // auth middleware থেকে আসবে

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission",
      });
    }

    next();
  };
};
```

**`validate.ts`** - Zod validation:

```typescript
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors,
      });
    }
  };
};
```

**`errorHandler.ts`** - Global error handler:

```typescript
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err : undefined,
  });
};
```

**app.ts তে add করতে হবে**:

```typescript
import { errorHandler } from "./middlewares/errorHandler";

// সব routes এর পরে
app.use(errorHandler);
```

---

#### 7. **Utilities**

- **Location**: `src/utils/`

**নতুন files তৈরি করতে হবে**:

**`response.ts`**:

```typescript
export const successResponse = (data: any, message = "Success") => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message: string, error?: any) => ({
  success: false,
  message,
  error,
});
```

**`asyncHandler.ts`**:

```typescript
import { Request, Response, NextFunction } from "express";

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

---

## 📂 কোন ফোল্ডারে কোন ফাইল তৈরি/আপডেট করতে হবে

### Phase 1: Utilities এবং Middlewares

```
src/
├── utils/
│   ├── response.ts (নতুন)
│   └── asyncHandler.ts (নতুন)
└── middlewares/
    ├── role.ts (নতুন)
    ├── validate.ts (নতুন)
    └── errorHandler.ts (নতুন)
```

### Phase 2: User Module

```
src/modules/user/
├── user.interface.ts (update)
├── user.validation.ts (নতুন)
├── user.service.ts (implement)
├── user.controller.ts (implement)
└── user.route.ts (implement)
```

### Phase 3: Review Module

```
src/modules/review/
├── review.interface.ts (update)
├── review.validation.ts (নতুন)
├── review.service.ts (implement)
├── review.controller.ts (implement)
└── review.route.ts (implement)
```

### Phase 4: Admin Module

```
src/modules/admin/
├── admin.interface.ts (implement)
├── admin.validation.ts (নতুন)
├── admin.service.ts (implement)
├── admin.controller.ts (implement)
└── admin.route.ts (implement)
```

### Phase 5: Tutor Module Completion

```
src/modules/tutor/
├── tutor.interface.ts (update)
├── tutor.validation.ts (নতুন)
├── tutor.service.ts (update - add functions)
├── tutor.controller.ts (update - add controllers)
└── tutor.route.ts (update - add routes)
```

### Phase 6: Booking Module Completion

```
src/modules/booking/
├── booking.interface.ts (update)
├── booking.validation.ts (নতুন)
├── booking.service.ts (update - add validations)
├── booking.controller.ts (update - add controllers)
└── booking.route.ts (update - add routes)
```

### Phase 7: App Integration

```
src/
└── app.ts (update - add all routes)
```

---

## 🎯 Priority Order (কোন ক্রমে করবে)

### Day 1-2: Foundation

1. ✅ `src/utils/response.ts`
2. ✅ `src/utils/asyncHandler.ts`
3. ✅ `src/middlewares/role.ts`
4. ✅ `src/middlewares/validate.ts`
5. ✅ `src/middlewares/errorHandler.ts`

### Day 3: User Module

6. ✅ User Module সম্পূর্ণ implement

### Day 4-5: Booking Completion

7. ✅ Booking Module এর বাকি কাজ (validations, complete, cancel)

### Day 6-7: Review Module

8. ✅ Review Module সম্পূর্ণ implement

### Day 8-10: Admin Module

9. ✅ Admin Module সম্পূর্ণ implement

### Day 11-12: Tutor Completion

10. ✅ Tutor Module এর বাকি কাজ

### Day 13-14: Testing

11. ✅ সব endpoints Postman দিয়ে test
12. ✅ Bug fixes

---

## 📝 Postman.md এবং Workflow.md সম্পর্কে

### ✅ Postman.md

- **Status**: সম্পূর্ণ এবং সঠিক
- সব endpoints এর documentation আছে
- Testing workflow আছে
- Auto token save scripts আছে
- **Action Required**: None - এটা ঠিক আছে

### ✅ Workflow.md

- **Status**: সম্পূর্ণ এবং সঠিক
- Database schema আছে
- API endpoints বিবরণ আছে
- Development workflow আছে
- **Action Required**: None - এটা ঠিক আছে

### ⚠️ Note

- Postman.md এবং Workflow.md এ কোনো কিছু add করার দরকার নেই
- এগুলো already complete এবং তোমার assignment requirements cover করে
- শুধু implementation করতে হবে যা এই documents এ লেখা আছে

---

## ✅ Final Checklist

### Must Complete (অবশ্যই করতে হবে):

- [ ] User Module (profile, password change)
- [ ] Review Module (create review, get reviews, update rating)
- [ ] Admin Module (user management, stats)
- [ ] Booking validations (availability check, price calculation)
- [ ] Booking status updates (complete, cancel)
- [ ] Role-based middleware
- [ ] Validation middleware

### Should Complete (করা উচিত):

- [ ] Tutor profile management
- [ ] Tutor availability management
- [ ] Error handling middleware
- [ ] Response utilities
- [ ] Async handler

### Nice to Have (optional):

- [ ] Seed data (admin user, categories)
- [ ] Better error messages
- [ ] Logging system

---

## 🚀 শুরু করার জন্য

1. **Utilities তৈরি করো** (response.ts, asyncHandler.ts)
2. **Middlewares তৈরি করো** (role.ts, validate.ts, errorHandler.ts)
3. **User Module** implement করো
4. **Booking Module** complete করো
5. **Review Module** implement করো
6. **Admin Module** implement করো
7. **Tutor Module** complete করো
8. **Testing** করো

প্রতিটা module শেষ করার পর Postman দিয়ে test করে নিও। কোনো সমস্যা হলে জানাও!

**শুভকামনা! 🎉**
