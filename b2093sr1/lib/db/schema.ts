import { pgTable, text, timestamp, integer, primaryKey, decimal, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

// Users table
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  credits: integer("credits").default(0).notNull(),
  role: text("role").default("user").notNull(), // user, seller, admin
});

// Accounts table for OAuth providers
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

// Sessions table for user sessions
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// Verification tokens for email verification
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

// FileChunks table for future RAG features with pgvector
export const fileChunks = pgTable("file_chunks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  content: text("content").notNull(),
  metadata: text("metadata"), // JSON string for file metadata
  // embedding: vector("embedding", { dimensions: 1536 }), // OpenAI embeddings - Commented out for Neon free tier
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
});

// Conversations table for chat sessions
export const conversations = pgTable("conversations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull().default("New Chat"),
  summary: text("summary"), // AI-generated conversation summary
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

// Messages table for chat messages
export const messages = pgTable("messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  conversationId: text("conversationId")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // "user" or "assistant"
  content: text("content").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

// Message attachments for files (images, docs, audio)
export const messageAttachments = pgTable("message_attachments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  messageId: text("messageId")
    .notNull()
    .references(() => messages.id, { onDelete: "cascade" }),
  fileName: text("fileName").notNull(),
  fileType: text("fileType").notNull(), // "image", "document", "audio"
  mimeType: text("mimeType").notNull(),
  fileSize: integer("fileSize").notNull(),
  fileUrl: text("fileUrl").notNull(), // Base64 or URL
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  conversations: many(conversations),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  attachments: many(messageAttachments),
}));

export const messageAttachmentsRelations = relations(messageAttachments, ({ one }) => ({
  message: one(messages, {
    fields: [messageAttachments.messageId],
    references: [messages.id],
  }),
}));

// ============================================
// E-COMMERCE TABLES
// ============================================

// Products table for marketplace
export const products = pgTable("products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image: text("image").notNull(), // URL or base64
  category: text("category").notNull(),
  stock: integer("stock").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  sellerId: text("seller_id").references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

// Shopping cart items
export const cartItems = pgTable("cart_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: text("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

// Orders table
export const orders = pgTable("orders", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending").notNull(), // pending, confirmed, shipped, delivered, cancelled
  shippingAddress: text("shippingAddress").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

// Order items (products in an order)
export const orderItems = pgTable("order_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: text("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("productId")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Price at time of order
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

// E-commerce Relations
export const productsRelations = relations(products, ({ many, one }) => ({
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  reviews: many(productReviews),
  seller: one(users, {
    fields: [products.sellerId],
    references: [users.id],
  }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

// Update users relations to include e-commerce
export const usersRelationsExtended = relations(users, ({ many }) => ({
  conversations: many(conversations),
  cartItems: many(cartItems),
  orders: many(orders),
}));

// Product reviews table
export const productReviews = pgTable("product_reviews", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  productId: text("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

// Product reviews relations
export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [productReviews.userId],
    references: [users.id],
  }),
}));

// Seller reviews table
export const sellerReviews = pgTable("seller_reviews", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  sellerId: text("seller_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sellerReviewsRelations = relations(sellerReviews, ({ one }) => ({
  seller: one(users, {
    fields: [sellerReviews.sellerId],
    references: [users.id],
    relationName: "sellerReviews",
  }),
  user: one(users, {
    fields: [sellerReviews.userId],
    references: [users.id],
    relationName: "reviewAuthor",
  }),
}));

// ============================================
// EXAM-COMPASS TABLES
// ============================================

// Exams table - stores all competitive exams
export const exams = pgTable("exams", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(), // e.g., "JEE Mains"
  fullName: text("full_name").notNull(), // e.g., "Joint Entrance Examination - Main"
  description: text("description").notNull(),
  category: text("category").notNull(), // Engineering, Medical, Law, Civil Services, etc.
  logoUrl: text("logo_url"),
  difficulty: text("difficulty").notNull(), // Easy, Medium, Hard
  totalSeats: integer("total_seats"),
  estimatedApplicants: integer("estimated_applicants"),
  syllabus: text("syllabus"), // JSON string with subjects and topics
  careerPaths: text("career_paths"), // JSON string with job/college opportunities
  examPattern: text("exam_pattern"), // JSON string with exam structure
  eligibility: text("eligibility"), // JSON string with eligibility criteria
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// Exam timelines - important dates for each exam
export const examTimelines = pgTable("exam_timelines", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  examId: text("exam_id")
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(), // registration, admit_card, exam_date, result
  eventName: text("event_name").notNull(),
  startDate: timestamp("start_date", { mode: "date" }),
  endDate: timestamp("end_date", { mode: "date" }),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// Mock questions - AI-generated and previous year questions
export const mockQuestions = pgTable("mock_questions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  examId: text("exam_id")
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(), // Physics, Chemistry, Math, etc.
  topic: text("topic").notNull(), // Specific topic within subject
  question: text("question").notNull(),
  options: text("options").notNull(), // JSON array of options
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  difficulty: text("difficulty").notNull(), // Easy, Medium, Hard
  questionType: text("question_type").notNull(), // MCQ, Numerical, etc.
  isAIGenerated: boolean("is_ai_generated").default(false).notNull(),
  basedOnYear: integer("based_on_year"), // Year of previous question if applicable
  tags: text("tags"), // JSON array of tags for better categorization
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// User exam preferences - which exams users are preparing for
export const userExamPreferences = pgTable("user_exam_preferences", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  examId: text("exam_id")
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  targetYear: integer("target_year").notNull(),
  preferredDifficulty: text("preferred_difficulty").default("Medium"),
  targetRank: integer("target_rank"),
  targetCollege: text("target_college"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// User progress - track performance on mock tests
export const userProgress = pgTable("user_progress", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  examId: text("exam_id")
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  questionId: text("question_id")
    .notNull()
    .references(() => mockQuestions.id, { onDelete: "cascade" }),
  userAnswer: text("user_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  timeSpent: integer("time_spent"), // Time in seconds
  attemptedAt: timestamp("attempted_at", { mode: "date" }).defaultNow().notNull(),
});

// Mock test sessions - track individual test attempts
export const mockTestSessions = pgTable("mock_test_sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  examId: text("exam_id")
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  difficulty: text("difficulty").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  correctAnswers: integer("correct_answers").default(0).notNull(),
  score: decimal("score", { precision: 5, scale: 2 }),
  timeSpent: integer("time_spent"), // Total time in seconds
  status: text("status").default("in_progress").notNull(), // in_progress, completed, abandoned
  startedAt: timestamp("started_at", { mode: "date" }).defaultNow().notNull(),
  completedAt: timestamp("completed_at", { mode: "date" }),
});

// Study groups - for peer collaboration
export const studyGroups = pgTable("study_groups", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  examId: text("exam_id")
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  maxMembers: integer("max_members").default(10).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// Study group members
export const studyGroupMembers = pgTable("study_group_members", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  groupId: text("group_id")
    .notNull()
    .references(() => studyGroups.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: text("role").default("member").notNull(), // admin, member
  joinedAt: timestamp("joined_at", { mode: "date" }).defaultNow().notNull(),
});

// User achievements and badges
export const userAchievements = pgTable("user_achievements", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  achievementType: text("achievement_type").notNull(), // streak, questions_solved, perfect_score, etc.
  achievementName: text("achievement_name").notNull(),
  description: text("description"),
  iconUrl: text("icon_url"),
  earnedAt: timestamp("earned_at", { mode: "date" }).defaultNow().notNull(),
});

// ============================================
// EXAM-COMPASS RELATIONS
// ============================================

export const examsRelations = relations(exams, ({ many }) => ({
  timelines: many(examTimelines),
  questions: many(mockQuestions),
  userPreferences: many(userExamPreferences),
  studyGroups: many(studyGroups),
  mockTestSessions: many(mockTestSessions),
}));

export const examTimelinesRelations = relations(examTimelines, ({ one }) => ({
  exam: one(exams, {
    fields: [examTimelines.examId],
    references: [exams.id],
  }),
}));

export const mockQuestionsRelations = relations(mockQuestions, ({ one, many }) => ({
  exam: one(exams, {
    fields: [mockQuestions.examId],
    references: [exams.id],
  }),
  userProgress: many(userProgress),
}));

export const userExamPreferencesRelations = relations(userExamPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userExamPreferences.userId],
    references: [users.id],
  }),
  exam: one(exams, {
    fields: [userExamPreferences.examId],
    references: [exams.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  exam: one(exams, {
    fields: [userProgress.examId],
    references: [exams.id],
  }),
  question: one(mockQuestions, {
    fields: [userProgress.questionId],
    references: [mockQuestions.id],
  }),
}));

export const mockTestSessionsRelations = relations(mockTestSessions, ({ one }) => ({
  user: one(users, {
    fields: [mockTestSessions.userId],
    references: [users.id],
  }),
  exam: one(exams, {
    fields: [mockTestSessions.examId],
    references: [exams.id],
  }),
}));

export const studyGroupsRelations = relations(studyGroups, ({ one, many }) => ({
  exam: one(exams, {
    fields: [studyGroups.examId],
    references: [exams.id],
  }),
  creator: one(users, {
    fields: [studyGroups.createdBy],
    references: [users.id],
  }),
  members: many(studyGroupMembers),
}));

export const studyGroupMembersRelations = relations(studyGroupMembers, ({ one }) => ({
  group: one(studyGroups, {
    fields: [studyGroupMembers.groupId],
    references: [studyGroups.id],
  }),
  user: one(users, {
    fields: [studyGroupMembers.userId],
    references: [users.id],
  }),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
}));
