/* 
    ====================== CLASSES ======================
*/
class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validar_parametros(){
        for(let key in this){
            console.log(this[key])
            if(this[key] == "" || this[key] == undefined || this[key] == null){
                return false
            }
        }
        return true
    }
}

class Bd{
    constructor(){
        let id = localStorage.getItem('id')
        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(despesa){
        let id = this.getProximoId()
        localStorage.setItem('id', id)

        localStorage.setItem(id, JSON.stringify(despesa))
    }

    recuperarRegistros(){
        let registros = []
        for(var i = 1; i <= localStorage.getItem('id'); i++){
            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa === null){
                continue
            }
            registros.push(despesa)
        }
        return registros
    }
    
}
let bd = new Bd

/* 
    ====================== FUNÇÕES DE REGISTRO ======================
*/
function registrarDespesa(){
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let nova_despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)
    
    if(nova_despesa.validar_parametros()){
        bd.gravar(nova_despesa)

        document.getElementById('modalLabel').innerHTML = 'Despesa adicionada'
        document.getElementById('modalBody').innerHTML = 'Sua despesa foi registrada com sucesso! :)'

        // Treinando métodos classList
        if(document.getElementById('modalHeader').classList.contains('text-danger')){
            document.getElementById('modalHeader').classList.remove('text-danger')
            document.getElementById('btnClose').classList.remove('btn-danger')
        }
        document.getElementById('modalHeader').classList.add('text-success')
        document.getElementById('btnConsulta').style.display = 'inline';
        document.getElementById('btnClose').classList.add('btn-success')
        
        document.getElementById('btnClose').innerHTML = 'Voltar'

        $('#modalGravacao').modal('show')
    }else{
        document.getElementById('modalLabel').innerHTML = 'Erro no registro'
        document.getElementById('modalBody').innerHTML = 'Existem campos obrigratórios que não foram preenchidos'
        if(document.getElementById('modalHeader').classList.contains('text-success')){
            document.getElementById('modalHeader').classList.remove('text-success')
            document.getElementById('btnClose').classList.remove('btn-success')
        }
        document.getElementById('modalHeader').classList.add('text-danger')
        document.getElementById('btnClose').classList.add('btn-danger')
        document.getElementById('btnConsulta').style.display = 'none';
        document.getElementById('btnClose').innerHTML = 'Voltar e corrigir'
        
        $('#modalGravacao').modal('show')
    }
}


/* 
    ====================== FUNÇÕES DE CONSULTA ======================
*/
function carregaListaDespesas(){
    let despesas = bd.recuperarRegistros()
    console.log(despesas)
    document.getElementById('tabela').innerHTML = ''
    
    for(let despesa in despesas){
        switch(despesas[despesa].tipo){
            case '1': 
                despesas[despesa].tipo = 'Alimentação'
                break;
            case '2': 
                despesas[despesa].tipo = 'Educação'
                break;
            case '3': 
                despesas[despesa].tipo = 'Lazer'
                break;
            case '4': 
                despesas[despesa].tipo = 'Saúde'
                break;
            case '5': 
                despesas[despesa].tipo = 'Transporte'
                break;
        }
        document.getElementById('tabela').innerHTML += `
        <td>${despesas[despesa].dia}/${despesas[despesa].mes}/${despesas[despesa].ano}</td>
        <td>${despesas[despesa].tipo}</td>
        <td>${despesas[despesa].descricao}</td>
        <td>${despesas[despesa].valor}</td>
        `
    }
}
