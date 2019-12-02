with get_provider_setting as
(
select value from settings where id = 'music_provider_id'
),
get_provider_detail as (
select t1.* from music_providers t1 inner join get_provider_setting t2 on t1.id = t2.value 
)
select * from get_provider_detail;