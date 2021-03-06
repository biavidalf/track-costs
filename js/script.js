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
            despesa.id = i
            registros.push(despesa)
        }
        console.log(registros)
        return registros
    }
    
    pesquisar(despesa){
        let despesas = this.recuperarRegistros()
        // Ano
        if(despesa.ano != ''){
            despesas = despesas.filter(d => d.ano == despesa.ano)
        }
            
        // Mes
        if(despesa.mes != ''){
            despesas = despesas.filter(d => d.mes == despesa.mes)
        }
            
        // Dia
        if(despesa.dia != ''){
            despesas = despesas.filter(d => d.dia == despesa.dia)
        }
            
        // Tipo
        if(despesa.tipo != ''){
            despesas = despesas.filter(d => d.tipo == despesa.tipo)
        }
            
        // Descricao
        if(despesa.descricao != ''){
            despesas = despesas.filter(d => (d.descricao).toLowerCase().includes((despesa.descricao).toLowerCase()))
        }
            
        // Valor
        if(despesa.valor != ''){
            despesas = despesas.filter(d => d.valor == despesa.valor)
        }
            
        return despesas
    }
}
let bd = new Bd

/* 
    ====================== FUN????ES DE REGISTRO ======================
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

        // Treinando m??todos classList
        if(document.getElementById('modalHeader').classList.contains('text-danger')){
            document.getElementById('modalHeader').classList.remove('text-danger')
            document.getElementById('btnClose').classList.remove('btn-danger')
        }
        document.getElementById('modalHeader').classList.add('text-success')
        document.getElementById('btnConsulta').style.display = 'inline';
        document.getElementById('btnClose').classList.add('btn-success')
        
        document.getElementById('btnClose').innerHTML = 'Voltar'

        ano.value = ""
        mes.value = ""
        dia.value = ""
        tipo.value = ""
        descricao.value = ""
        valor.value = ""

        $('#modalGravacao').modal('show')
    }else{
        modalErro('Erro no registro', 'Existem campos obrigrat??rios que n??o foram preenchidos', 'Voltar e corrigir')
    }
}


function modalErro(titulo, descricao, btn_title){
    document.getElementById('modalLabel').innerHTML = titulo
    document.getElementById('modalBody').innerHTML = descricao
    if(document.getElementById('modalHeader').classList.contains('text-success')){
        document.getElementById('modalHeader').classList.remove('text-success')
        document.getElementById('btnClose').classList.remove('btn-success')
    }
    document.getElementById('modalHeader').classList.add('text-danger')
    document.getElementById('btnClose').classList.add('btn-danger')
    document.getElementById('btnConsulta').style.display = 'none';
    document.getElementById('btnClose').innerHTML = btn_title
    
    $('#modalGravacao').modal('show')
}

/* 
    ====================== FUN????ES DE CONSULTA ======================
*/
function carregaListaDespesas(despesas = Array(), filtro = false){
    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarRegistros()
    }else if(despesas.length == 0 && filtro == true){
        modalErro('Consulta', 'N??o foi achado uma consulta com esses dados! :(', 'Pesquisar novamente')
    }
    
    document.getElementById('tabela').innerHTML = ''
    
    for(let despesa in despesas){
        switch(despesas[despesa].tipo){
            case '1': 
                despesas[despesa].tipo = 'Alimenta????o'
                break;
            case '2': 
                despesas[despesa].tipo = 'Educa????o'
                break;
            case '3': 
                despesas[despesa].tipo = 'Lazer'
                break;
            case '4': 
                despesas[despesa].tipo = 'Sa??de'
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
        <td><button id="${despesas[despesa].id}" onclick="removerDespesa(${despesas[despesa].id})" class="btn btn-primary btn-danger"><i class="fa-solid fa-rectangle-xmark"></i></button></td>
        `
        
    }
}

function pesquisarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    let despesas = bd.pesquisar(despesa)

    carregaListaDespesas(despesas, true)
}

function removerDespesa(id_despesa){
    localStorage.removeItem(id_despesa);
    carregaListaDespesas()
}