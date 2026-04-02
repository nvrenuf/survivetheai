alter table public.subscribers
  add column if not exists signup_intent text,
  add column if not exists lead_segment text,
  add column if not exists interest_area text;

update public.subscribers
set
  signup_intent = case
    when source_page = 'playbook' then 'playbook'
    else 'briefing'
  end,
  lead_segment = case
    when source_page = 'playbook' then 'action-seeker'
    when source_page = 'start-here' then 'new-reader'
    when source_page = 'post' then 'article-deep-dive'
    when source_page like 'hub-%' then 'hub-specific'
    else 'general-briefing'
  end,
  interest_area = case
    when source_page like 'hub-%' then replace(source_page, 'hub-', '')
    else null
  end
where signup_intent is null or lead_segment is null;
