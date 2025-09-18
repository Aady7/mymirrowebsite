# Storage Setup for Enhanced Lookbooks

## Supabase Storage Setup

You need to create a storage bucket for custom avatar uploads. Run this in your Supabase SQL Editor:

```sql
-- Create storage bucket for lookbook avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('lookbook-avatars', 'lookbook-avatars', true);

-- Set up storage policies for authenticated users
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'lookbook-avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'lookbook-avatars');

CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (bucket_id = 'lookbook-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE USING (bucket_id = 'lookbook-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Alternative: Manual Setup in Supabase Dashboard

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `lookbook-avatars`
3. Make it public
4. Set up the RLS policies as shown above

The storage is now ready for custom avatar uploads!