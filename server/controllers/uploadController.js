const csv = require("csvtojson");
const {connectToCluster} = require("./../utils/dbConnector");

const uploadExcelSheet = async (req, res) => {
  try {
    csv()
        .fromFile(req.file.path)
        .then(async (json) => {
          console.log(req.file);

          // save file entry
          const client = await connectToCluster();
          const filesListdb = client.db("files");
          const listcollection = filesListdb.collection("list");
          const resp = await listcollection.insertOne(req.file);

          const fileId = req.file.filename;

          if (!fileId) throw new Error('No File Found');

          const finalData = json.map(obj=>{
            return { ...obj, fileId };
          });

          // save file contents
          const filesContentCollection = filesListdb.collection("content");
          await filesContentCollection.insertMany(finalData);

          res.send({status: 200, success: false, data: { ...req.file, _id: resp.insertedId }});
        })
        .catch((err) => console.error(err));
  } catch (err) {
    res.send({status: 400, success: false, msg: err.message});
  }
};

module.exports = {
  uploadExcelSheet,
};
