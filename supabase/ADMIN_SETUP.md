# RDDS Supabase admin setup

1. In Supabase Dashboard → Authentication → Users, create the administrator using Email/Password.
2. Copy the user's UUID.
3. In SQL Editor, run (replace the UUID with the actual Auth user UUID):

```sql
insert into public.admin_users (user_id)
values ('00000000-0000-0000-0000-000000000000');
```

4. In Vercel → Project → Settings → Environment Variables, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`

Use the project URL and **publishable** key from Supabase Project Settings → API.
Never put a service-role or secret key in a Vercel `VITE_*` variable or browser code.
Redeploy after setting the variables.

The admin allowlist is intentionally separate from sign-up metadata. A signed-in account is not an administrator unless its UUID exists in `public.admin_users`.
