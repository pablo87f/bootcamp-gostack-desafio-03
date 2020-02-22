import Sequelize from 'sequelize';
import databaseConfig from '../config/database.config';
import User from '../app/models/user.model';
import Recipient from '../app/models/recipient.model';
import File from '../app/models/file.model';
import Deliverer from '../app/models/deliverer.model';
import Order from '../app/models/order.model';
import OrderProblem from '../app/models/order-problem.model';

const models = [User, Recipient, File, Deliverer, Order, OrderProblem];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);
        models
            .map(model => model.init(this.connection))
            .map(
                model =>
                    model.associate && model.associate(this.connection.models)
            );
    }
}

export default new Database();
