const csv = require('csvtojson');
// const apicache =  require('apicache');
const { connectToCluster } = require('../utils/dbConnector');

const getUserExcels = async (req, res) => {
    try{
        // cache group
        req.apicacheGroup = 'getAllUserSheets';

        const client = await connectToCluster();
        const db = client.db('files');
        const collection = await db.collection('list');
        const files = await collection.find().toArray();

        res.send({ status: 200, success: false, data: files });
    }
    catch (err) {
        res.send({ status: 400, success: false, msg:err.message });
    }
}

getUserExcelData = async (req, res) => {
    try{
        const fileId = req.query.fileId;
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 30;
        const skip = limit * (page - 1)
        
        if (!fileId) throw new Error('file id is required');

        const client = await connectToCluster();
        const db = client.db('files');
        const collection = await db.collection('content');

        // search ops
        const query = req.query.query;
        if (query) {
            const pipeline = [];
            pipeline.push({
                $search:{
                    index: 'data-search',
                    "compound":{
                        must:[
                            {
                                text: {
                                    query: query,
                                    path:{
                                        wildcard: "*"
                                    },
                                    fuzzy:{}
                                }
                            },
                            {
                                "text": {
                                  "path": "fileId",
                                  "query": fileId,
                                }
                            }
                        ]
                    }
                }
            });

            pipeline.push({
                $facet: {
                    paginatedResults:[{ $skip: skip }, { $limit: limit }],
                    totalCount: [
                        {
                          $count: 'count'
                        }
                      ]
                }
            });

            const aggregateQuery = await collection.aggregate(pipeline).toArray();
            console.log(aggregateQuery);
            const result = aggregateQuery[0];
            if (!result || !result?.paginatedResults?.length) {
                return res.send({ 
                    status: 200, 
                    success: false,
                    msg:'No results found',
                    data:[]
                });
            };

            const totalDocs = result?.totalCount?.[0]?.count;
            const total_page = Math.ceil(totalDocs / limit);

            if (total_page < page) throw new Error('page no not found');

            return res.send({ 
                status: 200, 
                success: false, 
                // result,
                data: result.paginatedResults, 
                pagination:{
                    total_page,
                    current_page: page,
                } 
            });
        }

        // get data
        const data = await collection.find({ fileId : { $eq: fileId } }).skip(skip).limit(limit).toArray();
        console.log(data);
        // pagination info
        const totalDocs = await collection.find({ fileId : { $eq: fileId } }).count();
        const total_page = Math.ceil(totalDocs / limit);

        if (total_page < page) throw new Error('page no not found -'+ totalDocs);

        const pagination = {
            total_page,
            current_page: page,
        }

        res.send({ status: 200, success: false, data: data, pagination });
    }
    catch (err) {
        res.send({ status: 400, success: false, msg:err.message });
    }
}

module.exports = {
    getUserExcels,
    getUserExcelData
}