#!/bin/bash

echo "========================================="
echo "TeachersGallery Profile Database Fix Script"
echo "========================================="
echo
echo "This script will fix the profile timeout issue by adding:"
echo "1. updated_at column to profiles table"
echo "2. notification_preferences column to profiles table"
echo "3. Creating a trigger to update the updated_at column automatically"
echo

read -p "Would you like to proceed? (Y/n): " response

# Default to Yes if no response is given
response=${response:-Y}

if [[ $response =~ ^[Yy]$ ]]; then
    echo
    echo "Running profile database fixes..."
    echo

    # Check if Supabase CLI is available
    if command -v supabase &> /dev/null; then
        echo "✅ Supabase CLI is installed, using it for the migration..."
        supabase db query "ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());"
        supabase db query "ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{}'::jsonb;"
        supabase db query "CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS \$\$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; \$\$ language 'plpgsql';"
        supabase db query "DO \$\$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_profiles_updated_at') THEN CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); END IF; END \$\$;"
    else
        echo "❌ Supabase CLI is not installed."
        echo "Please run these SQL commands in your Supabase dashboard SQL editor:"
        echo
        echo "ALTER TABLE public.profiles"
        echo "ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());"
        echo
        echo "ALTER TABLE public.profiles"
        echo "ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{}'::jsonb;"
        echo
        echo "CREATE OR REPLACE FUNCTION update_updated_at_column()"
        echo "RETURNS TRIGGER AS \$\$"
        echo "BEGIN"
        echo "   NEW.updated_at = NOW();"
        echo "   RETURN NEW;"
        echo "END;"
        echo "\$\$ language 'plpgsql';"
        echo
        echo "DO \$\$"
        echo "BEGIN"
        echo "  -- Check if trigger exists before creating"
        echo "  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_profiles_updated_at') THEN"
        echo "    CREATE TRIGGER set_profiles_updated_at"
        echo "    BEFORE UPDATE ON public.profiles"
        echo "    FOR EACH ROW"
        echo "    EXECUTE FUNCTION update_updated_at_column();"
        echo "  END IF;"
        echo "END"
        echo "\$\$;"
    fi

    echo
    echo "✅ Database fixes have been applied!"
    echo
    echo "Please restart your Next.js application to apply the changes:"
    echo "$ npm run dev"
    echo
else
    echo "Operation cancelled."
fi 