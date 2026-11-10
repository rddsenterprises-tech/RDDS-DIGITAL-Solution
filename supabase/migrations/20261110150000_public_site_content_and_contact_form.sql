alter table public.projects
  add column if not exists website_url text not null default '';

alter table public.blog_posts
  add column if not exists content text not null default '';

create policy "Public can submit contact messages"
on public.contact_messages
for insert
to anon, authenticated
with check (
  length(trim(name)) > 0
  and length(trim(email)) > 0
  and length(trim(message)) > 0
);

grant insert on public.contact_messages to anon, authenticated;
