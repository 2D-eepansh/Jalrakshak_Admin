# Database Migration Instructions

## Run this SQL in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Copy and paste the entire content from `backend/migrations/000_init.sql`
4. Click "Run" to execute the migration

## What this migration creates:

- ✅ All required tables (user_locations, alert_subscriptions, flood_reports, etc.)
- ✅ Row Level Security (RLS) policies for admin-only access
- ✅ Sample location data for India
- ✅ Proper indexes for performance

## After running the migration:

1. Create an admin user in Authentication → Users
2. Copy the admin user's UUID
3. Update VITE_ADMIN_USER_ID in .env file
4. Set the admin_user_id setting in Supabase

The migration is ready to run!
