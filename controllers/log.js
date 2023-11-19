const db = require("../db/db");

const isValidTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return !isNaN(date);
};


const addLog = async(req, res) => {

    const data = req.body;
    const insertQuery = `INSERT INTO logs(
         level, message, resourceid, "timestamp", traceid, spanid, commit, parentresourceid)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
    try {
        
        await db.query(insertQuery, [data?.level, data?.message, data?.resourceId, data?.timestamp, data?.traceId, data?.spanId, 
        data?.commit, data?.metadata?.parentResourceId]);
        

        return res.status(201).json({
            status: true,
            message: "Log Added Successfully!"
        })
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        })
    }
}


const getLogs = async(req, res) => {


    const {level, message, resourceId, timestart, timeend, traceId, spanId, commit, parentResourceId, page=1, limit=7} = req.query;
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    
    const offset = (pageInt-1)*limitInt;
    
    
    let query = `SELECT id, level, message, resourceid, "timestamp", traceid, spanid, commit, parentresourceid
	FROM logs WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) AS total FROM logs WHERE 1=1`;

    const params = [];
    const totalParams = [];

    if(level){
        query += ` AND level ILIKE $${params.length + 1}`;
        countQuery += ` AND level ILIKE $${params.length + 1}`;
        params.push(`%${level}%`);
        totalParams.push(`%${level}%`);
    }
    if(message){
        query += ` AND message ILIKE $${params.length + 1}`;
        countQuery += ` AND message ILIKE $${params.length + 1}`;
        params.push(`%${message}%`)
        totalParams.push(`%${message}%`)
    }

    if(resourceId){
        query += ` AND resourceid ILIKE $${params.length + 1}`;
        countQuery += ` AND resourceid ILIKE $${params.length + 1}`;
        params.push(`%${resourceId}%`);
        totalParams.push(`%${resourceId}%`);
    }
    if(traceId){
        query += ` AND traceid ILIKE $${params.length + 1}`;
        countQuery += ` AND traceid ILIKE $${params.length + 1}`;
        params.push(`%${traceId}%`);
        totalParams.push(`%${traceId}%`);
    }
    if(spanId){
        query += ` AND spanid ILIKE $${params.length + 1}`;
        countQuery += ` AND spanid ILIKE $${params.length + 1}`;
        params.push(`%${spanId}%`);
        totalParams.push(`%${spanId}%`);
    }
    if(commit){
        query += ` AND commit ILIKE $${params.length + 1}`;
        countQuery += ` AND commit ILIKE $${params.length + 1}`;
        params.push(`%${commit}%`);
        totalParams.push(`%${commit}%`);
    }
    if(parentResourceId){
        query += ` AND parentresourceid ILIKE $${params.length + 1}`;
        countQuery += ` AND parentresourceid ILIKE $${params.length + 1}`;
        params.push(`%${parentResourceId}%`);
        totalParams.push(`%${parentResourceId}%`);
    }

    if (timestart && isValidTimestamp(timestart) && timeend && isValidTimestamp(timeend)) {
        query += ` AND ("timestamp" >= $${params.length + 1}::timestamp AND "timestamp" <= $${params.length + 2}::timestamp)`;
        countQuery += ` AND ("timestamp" >= $${params.length + 1}::timestamp AND "timestamp" <= $${params.length + 2}::timestamp)`;
        params.push(timestart, timeend);
        totalParams.push(timestart, timeend);
    } else if (timestart && isValidTimestamp(timestart)) {
        query += ` AND ("timestamp" >= $${params.length + 1}::timestamp)`;
        countQuery += ` AND ("timestamp" >= $${params.length + 1}::timestamp)`;
        params.push(timestart);
        totalParams.push(timestart);
    } else if (timeend && isValidTimestamp(timeend)) {
        query += ` AND ("timestamp" <= $${params.length + 1}::timestamp)`;
        countQuery += ` AND ("timestamp" <= $${params.length + 1}::timestamp)`;
        params.push(timeend);
        totalParams.push(timeend);
    }

    
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    
    params.push(limit, offset);


    try {
        const {rows} = await db.query(query, params);
        const { rows: countRows } = await db.query(countQuery, totalParams);
        const totalCount =  countRows[0]?.total ? countRows[0]?.total : 0;
        

        return res.status(200).json({
            status: true,
            logs: rows,
            totalCount
        })

    } catch (error) {
        console.log(error.message);
        return res.status(200).json({
            status: false,
            message: "Internal Server Error"
        })
    }
}


module.exports = {
    addLog,
    getLogs
}