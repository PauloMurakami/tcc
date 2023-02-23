import express from "express"
import { AppDataSource } from "./data-source"
import router from "./routes"
import cors from 'cors';
import { RoleEnumType, User } from "./entity/User";
require('dotenv').config();
const { errors } = require('celebrate');

const app = express()

AppDataSource.initialize().then(async () => {
  const userRepository = AppDataSource.getRepository(User)
  const nome = process.env.USUARIO;
  const senha = process.env.SENHA;
  const email = process.env.EMAIL;
  const permiteVerificacao = true;
  const userExists = await userRepository.findOne({ where: { email } })
  if (!userExists) {
    const role = RoleEnumType.FACULDADE;
    const user = userRepository.create({ nome, email, senha, permiteVerificacao })
    user.role = role;
    await userRepository.save(user)
    console.log("Usuario Sistemico criado")
  }
  //Podemos utilizar aqui para criar o usuario root do sistema (como a faculdade)

}).catch(error => console.log(error))
app.use(express.json())
app.use(cors())
app.use(router)
app.use(errors());
app.listen(8080, () => {
  console.log('Servidor esta rodando na porta 8080')
})