import * as express from "express"
import { AppDataSource } from "./data-source"
import router from "./routes"

const app = express()

AppDataSource.initialize().then(async () => {

  //Podemos utilizar aqui para criar o usuario root do sistema (como a faculdade)

}).catch(error => console.log(error))

app.use(express.json())
app.use(router)

app.listen(8080, ()=>{
    console.log('Servidor esta rodando na porta 8080')
})