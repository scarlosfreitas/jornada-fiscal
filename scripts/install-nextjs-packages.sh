#!/usr/bin/env bash
npm install @prisma/client@^6.19.0    #// Query database in your code (ORM)  
npm install -D prisma@^6.19.0   #// CLI for migrations, studio, generate
 
# 3. Install Authentication (NextAuth.js v5)
npm install next-auth@beta   #// Authentication system for Next.js (v5)
npm install @auth/prisma-adapter   #// Connects NextAuth sessions/users to Prisma DB
npm install bcryptjs   #// Hash & verify passwords
npm install -D @types/bcryptjs  #// TypeScript types for bcryptjs

# 4. Install Form Validation
npm install zod  #// Schema validation for forms & API inputs

# 5. Install UUID Generator
npm install uuid  #// Generate unique IDs (e.g., user IDs)
npm install -D @types/uuid   #// TypeScript types for uuid

# 6. Install File Upload Handler
npm install formidable #// Parse file uploads (PDF )
npm install -D @types/formidable  #// TypeScript types for formidable
npm install pdf-parse  #// Extract text from PDF

# 7. Install MySQL Driver
# npm install mysql2   #// MySQL driver for Node.js connection

# 8. Install Toast
npm install react-hot-toast  #// Show toast notifications (success/error)

# 9. Minhas dependencias
npm install @aws-sdk/client-s3 # Minio
npm install ioredis # Redis
npm install -D @types/ioredis # Redis
npm install kafkajs # Kafka