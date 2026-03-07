-- Create materialized view for author metrics
CREATE MATERIALIZED VIEW IF NOT EXISTS "AuthorMetrics" AS
SELECT
    p.id as profile_id,
    COALESCE(SUM(c.word_count), 0) as total_words,
    COALESCE(SUM(CASE WHEN c.generation_source = 'manual' THEN c.word_count ELSE 0 END), 0) as words_manual,
    COALESCE(SUM(CASE WHEN c.generation_source != 'manual' THEN c.word_count ELSE 0 END), 0) as words_ai,
    COALESCE(AVG(c.ai_contribution_percent), 0) as ai_collaboration_ratio,
    CURRENT_TIMESTAMP as last_refreshed
FROM
    "Profile" p
LEFT JOIN
    "Chapter" c ON p.id = c.owner_id
GROUP BY
    p.id;

-- Create index on the materialized view
CREATE UNIQUE INDEX IF NOT EXISTS "AuthorMetrics_profile_id_idx" ON "AuthorMetrics" (profile_id);

-- Create function to refresh metrics
CREATE OR REPLACE FUNCTION refresh_author_metrics()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY "AuthorMetrics";
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh metrics on chapter updates
CREATE TRIGGER refresh_author_metrics_trigger
AFTER INSERT OR UPDATE OR DELETE ON "Chapter"
FOR EACH STATEMENT EXECUTE FUNCTION refresh_author_metrics();
