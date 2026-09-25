let abastecimentos = JSON.parse(
    localStorage.getItem("abastecimentos")
) || [];

let editando = null;

function entrar() {
    document.getElementById("splash").classList.add("oculto");
    document.getElementById("app").classList.remove("oculto");

    mostrarLista();
}

function abrirModal(id = null) {
    document.getElementById("modal").classList.remove("oculto");

    editando = id;

    if(id) {
        let item = abastecimentos.find(x => x.id === id);
        document.getElementById("tituloModal").textContent = "Editar abastecimento";
        document.getElementById("id").value = item.id;
        document.getElementById("data").value = item.data;
        document.getElementById("combustivel").value = item.combustivel;
        document.getElementById("litros").value = item.litros;
        document.getElementById("valor").value = item.valor;
        document.getElementById("km").value = item.km;

    } else {
        document.getElementById("tituloModal").textContent = "Novo abastecimento";
        document.getElementById("id").value = "";
        document.getElementById("data").value = new Date().toISOString().split("T")[0];
        document.getElementById("combustivel").value = "";
        document.getElementById("litros").value = "";
        document.getElementById("valor").value = "";
        document.getElementById("km").value = "";
    }
}

function fecharModal() {
    document.getElementById("modal").classList.add("oculto");
}

function salvar(event) {
    event.preventDefault();

    let item = {
        id: editando || Date.now(),
        data: document.getElementById("data").value,
        combustivel: document.getElementById("combustivel").value,
        litros: Number(document.getElementById("litros").value),
        valor: Number(document.getElementById("valor").value),
        km: Number(document.getElementById("km").value)
    };

    if (editando) {
        let index = abastecimentos.findIndex(x => x.id === editando);
        abastecimentos[index] = item;

    }else {
        abastecimentos.push(item);
    }

    salvarLocalStorage();
    fecharModal();
    mostrarLista();
}

function salvarLocalStorage() {
    localStorage.setItem("abastecimentos", JSON.stringify(abastecimentos));
}

function mostrarLista() {
    let lista = document.getElementById("lista");

    lista.innerHTML = "";
    abastecimentos.sort((a, b) => a.km - b.km);

    abastecimentos.forEach((item, index) => {
        let preco = item.valor / item.litros;
        let consumo = "--";

    if (index > 0) {
        let anterior = abastecimentos[index - 1];
        let distancia = item.km - anterior.km;
       
    if (distancia > 0) {
        consumo = (distancia / item.litros).toFixed(2)+ " km/L";
    }
}

    let div = document.createElement("div");

    div.className = "item";
    div.innerHTML = `
    <div onclick="abrirModal(${item.id})">
        <h3>
            ⛽ ${item.combustivel}
        </h3>
        <p>
            ${formatarData(item.data)}
            |
            ${item.km} km
        </p>
    </div>
    <div onclick="abrirModal(${item.id})">
        <strong>
            R$ ${preco.toFixed(2)}
        </strong>
        <p>
            ${item.litros} litros
        </p>
        <p class="consumo">
        ${consumo}
        </p>
    </div>
    <button
        class="lixeira"
        onclick="excluir(${item.id})">
        ❌
    </button>`;

    lista.appendChild(div);

    }
);

    atualizarResumo();
}

function excluir(id) {
    if (
        !confirm("Deseja excluir este abastecimento?")
    ) {
        return;
    }

    abastecimentos = abastecimentos.filter(item => item.id !== id);

    salvarLocalStorage();
    mostrarLista();
}

function atualizarResumo() {
    let total = abastecimentos.length;
    let litros = 0;
    let valor = 0;

    abastecimentos.forEach(item => {
        litros += item.litros;
        valor += item.valor;
    });

    let precoMedio = litros > 0 ? valor / litros : 0;

    document.getElementById("mediaPreco").textContent = "R$ " + precoMedio.toFixed(2);
    document.getElementById("total").textContent = total;

    let distancia = 0;
    let litrosConsumo = 0;

    for (
        let i = 1;
        i < abastecimentos.length;
        i++
    ) {
        let km = abastecimentos[i].km - bastecimentos[i - 1].km;

        if (km > 0) {
            distancia += km;
            litrosConsumo += abastecimentos[i].litros;
        }
    }

    let consumoMedio = litrosConsumo > 0 ? distancia / litrosConsumo : 0;

    document.getElementById("mediaConsumo").textContent = consumoMedio.toFixed(2) + " km/L";
}

function formatarData(data) {
    let partes = data.split("-");

    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );
}

mostrarLista();
