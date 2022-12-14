import "reflect-metadata"
import { DataSource } from "typeorm"
import { Evento } from "./entity/Eventos"
import { ListaDeCadastrados } from "./entity/ListaDeCadastrados"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "tcc",
    synchronize: true,
    logging: false,
    entities: [User , Evento, ListaDeCadastrados],
    migrations: [],
    subscribers: [],
})
