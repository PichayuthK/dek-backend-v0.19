var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//mongoose.bdName = "mongodb://localhost:27017/Dek";
//mongoose.connect("mongodb://localhost:27017/Dek");
mongoose.bdName = "mongodb://$ADMIN_USERNAME/:$PASSWORD@dek-backend-2-shard-00-00-ttnfq.mongodb.net:27017,dek-backend-2-shard-00-01-ttnfq.mongodb.net:27017,dek-backend-2-shard-00-02-ttnfq.mongodb.net:27017/Dek?ssl=true&replicaSet=Dek-Backend-2-shard-0&authSource=admin";
mongoose.connect("mongodb://$ADMIN_USERNAME:$PASSWORD@dek-backend-2-shard-00-00-ttnfq.mongodb.net:27017,dek-backend-2-shard-00-01-ttnfq.mongodb.net:27017,dek-backend-2-shard-00-02-ttnfq.mongodb.net:27017/Dek?ssl=true&replicaSet=Dek-Backend-2-shard-0&authSource=admin");

module.exports = {
    mongoose
};
