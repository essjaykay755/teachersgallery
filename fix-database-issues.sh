#!/bin/bash

echo "========================================="
echo "TeachersGallery Database Fixer Script"
echo "========================================="
echo ""

# Check if Supabase CLI is installed
if command -v supabase &> /dev/null; then
    echo "✅ Supabase CLI is installed"
else
    echo "❌ Supabase CLI is not installed"
    echo "    Using alternative method..."
fi

echo ""
echo "This script will add missing columns to your database tables to fix:"
echo "1. Profile update hanging on 'saving...'"
echo "2. Teacher profile loading errors"
echo "3. Favorites tab loading issue"
echo ""
echo "Would you like to proceed? (Y/n)"
read -r response

# Default to Yes if no response is given
response=${response:-Y}

if [[ $response =~ ^[Yy]$ ]]; then
    echo ""
    echo "Running database fixes..."
    echo ""

    if command -v node &> /dev/null; then
        # Run the Node.js script to apply migrations
        echo "Running migration script..."
        node scripts/apply-migrations.js
    else
        echo "❌ Node.js is not installed. Please run the following SQL in your Supabase dashboard:"
        echo ""
        echo "-- Add updated_at column to profiles table"
        echo "ALTER TABLE public.profiles"
        echo "ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());"
        echo ""
        echo "-- Add notification_preferences column to profiles table"
        echo "ALTER TABLE public.profiles"
        echo "ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{}'::jsonb;"
        echo ""
        echo "-- Add gender column to profiles table if it doesn't exist"
        echo "ALTER TABLE public.profiles"
        echo "ADD COLUMN IF NOT EXISTS gender text DEFAULT 'male';"
        echo ""
        echo "-- Add gender column to teacher_profiles table if it doesn't exist"
        echo "ALTER TABLE public.teacher_profiles"
        echo "ADD COLUMN IF NOT EXISTS gender text DEFAULT 'male';"
        echo ""
        echo "-- Create trigger to automatically update the updated_at column"
        echo "CREATE OR REPLACE FUNCTION update_updated_at_column()"
        echo "RETURNS TRIGGER AS $$"
        echo "BEGIN"
        echo "   NEW.updated_at = NOW();"
        echo "   RETURN NEW;"
        echo "END;"
        echo "$$ language 'plpgsql';"
        echo ""
        echo "-- Create trigger for profiles table"
        echo "DO $$"
        echo "BEGIN"
        echo "  -- Check if trigger exists before creating"
        echo "  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_profiles_updated_at') THEN"
        echo "    CREATE TRIGGER set_profiles_updated_at"
        echo "    BEFORE UPDATE ON public.profiles"
        echo "    FOR EACH ROW"
        echo "    EXECUTE FUNCTION update_updated_at_column();"
        echo "  END IF;"
        echo "END"
        echo "$$;"
    fi

    echo ""
    echo "✅ Database fixes have been applied!"
    echo ""
    echo "Please restart your Next.js application to apply the changes:"
    echo "$ npm run dev"
    echo ""
else
    echo "Operation cancelled."
fi 