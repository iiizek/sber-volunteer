select 0, t0.ID c2, t0.LIMITED_OFFER c3, t2.CODE c4, t2.ID c5 from F_PRODUCT_LIMITED t0 left join F_PRODUCT t1 on t0.ID = t1.ID left join F_ENTITY t2 on t0.ID = t2.ID where t1.CREATOR_CODE > :p0::bigint
