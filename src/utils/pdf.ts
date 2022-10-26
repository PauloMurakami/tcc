import { IPDF } from "../@types/pdf";

var fs = require('fs');
var pdf = require('html-pdf');
var options = { format: 'Letter' };

export async function criarPDF(params: IPDF) {
    return new Promise<void>(async function (resolve, reject) {
        await pdf.create(params.html, options).toFile(`./src/public/assets/${params.id}.pdf`, function (err, res) {
            if (err) return console.log(err);
            // console.log(res); 
            resolve()
        });
    })
}
export async function deletarPDF(id: string) {
    return new Promise<void>(async function (resolve, reject) {
        try {
            await fs.unlinkSync(`./src/public/assets/${id}.pdf`);
            console.log('arquivo deletado')
            resolve();
        } catch (error) {
            console.log(error)
        }
    })
}
