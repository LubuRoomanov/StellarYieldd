document.addEventListener('DOMContentLoaded', function() {
    // Dados dos itens (naves, planetas, mineradoras)
    const items = {
        ships: [
            { name: 'Swift Star', image: 'nave1.png', earnings: 10, cost: 200, days: 30, quantity: 0 },
            { name: 'Galactic Falcon', image: 'nave2.png', earnings: 15, cost: 300, days: 30, quantity: 0 },
            { name: 'Destiny Cruiser', image: 'nave3.png', earnings: 20, cost: 400, days: 30, quantity: 0 },
            { name: 'Sonic Comet', image: 'nave4.png', earnings: 25, cost: 500, days: 30, quantity: 0 },
            { name: 'Stellar Vortex', image: 'nave5.png', earnings: 30, cost: 600, days: 30, quantity: 0 }
        ],
        planets: [
            { name: 'Planeta 1', image: 'IMG/planet1.png', earnings: 50, cost: 800, days: 60, quantity: 0 },
            { name: 'Planeta 2', image: 'IMG/planet2.png', earnings: 60, cost: 900, days: 60, quantity: 0 },
            { name: 'Planeta 3', image: 'IMG/planet3.png', earnings: 70, cost: 1000, days: 60, quantity: 0 },
            { name: 'Planeta 4', image: 'IMG/planet4.png', earnings: 80, cost: 1100, days: 60, quantity: 0 },
            { name: 'Planeta 5', image: 'IMG/planet5.png', earnings: 90, cost: 1200, days: 60, quantity: 0 }
        ],
        miners: [
            { name: 'Mineradora 1', image: 'IMG/miner1.png', earnings: 40, cost: 700, days: 45, quantity: 0 },
            { name: 'Mineradora 2', image: 'IMG/miner2.png', earnings: 45, cost: 750, days: 45, quantity: 0 },
            { name: 'Mineradora 3', image: 'IMG/miner3.png', earnings: 50, cost: 800, days: 45, quantity: 0 },
            { name: 'Mineradora 4', image: 'IMG/miner4.png', earnings: 55, cost: 850, days: 45, quantity: 0 },
            { name: 'Mineradora 5', image: 'IMG/miner5.png', earnings: 60, cost: 900, days: 45, quantity: 0 }
        ]
    };

    // Variáveis para armazenar a quantidade total e o rendimento diário total
    let totalQuantity = 0;
    let totalEarnings = 0;

    // Armazena a quantidade de dias restantes para cada item
    let purchasedItems = [];

    // Função para exibir itens de uma categoria
    function displayItems(category) {
        const container = document.getElementById('items-container');
        container.innerHTML = ''; // Limpa o container

        items[category].forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.classList.add('item-card');
            itemCard.dataset.itemName = item.name; // Adiciona o nome do item como um atributo de dados
            itemCard.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>Quantidade: <span class="item-quantity">${item.quantity}</span></p>
            `;

            // Adiciona o evento de clique no item
            itemCard.addEventListener('click', () => {
                openPopup(item);
            });

            container.appendChild(itemCard);
        });
    }

    // Função para abrir o pop-up
    function openPopup(item) {
        document.getElementById('popup-item-name').textContent = item.name;
        document.getElementById('popup-item-cost').textContent = `Custo: ${item.cost} STC`;
        document.getElementById('popup-item-earnings').textContent = `Rendimento: ${item.earnings} STC/dia`;
        document.getElementById('popup-item-days').textContent = `Dias Rendendo: ${item.days}`;
        
        // Exibe o pop-up
        document.getElementById('item-popup').style.display = 'block';

        // Adiciona evento de clique no botão de compra
        document.getElementById('buy-button').onclick = () => {
            const quantityInput = document.getElementById('quantity');
            const quantity = parseInt(quantityInput.value);

            // Verifica se a quantidade é um número válido
            if (isNaN(quantity) || quantity <= 0) {
                alert("Por favor, insira uma quantidade válida.");
                return;
            }

            totalQuantity += quantity; // Atualiza a quantidade total
            totalEarnings += item.earnings * quantity * item.days; // Atualiza o rendimento total

            // Atualiza a quantidade do item comprado
            item.quantity += quantity; // Incrementa a quantidade do item
            const itemCard = Array.from(document.querySelectorAll('.item-card')).find(card => card.dataset.itemName === item.name);
            if (itemCard) {
                itemCard.querySelector('.item-quantity').textContent = item.quantity; // Atualiza a quantidade exibida no card
            }

            // Atualiza o resumo na página
            updateSummaryDisplay();

            alert(`Você comprou ${quantity} ${item.name}(s)!`);
            document.getElementById('item-popup').style.display = 'none'; // Fecha o pop-up
            checkExpiredItems(); // Verifica se algum item expirou
        };
    }

    // Função para atualizar a exibição do resumo
    function updateSummaryDisplay() {
        document.getElementById('summary-quantity').textContent = `Quantidade total: ${totalQuantity}`;
        document.getElementById('current-earnings').textContent = `${totalEarnings} STC/dia`;
    }

    // Função para verificar itens expirados
    function checkExpiredItems() {
        purchasedItems = purchasedItems.filter(purchasedItem => {
            if (purchasedItem.daysRemaining > 0) {
                purchasedItem.daysRemaining -= 1; // Decrementa o contador de dias
                return true; // Mantém o item
            } else {
                // Se o item expirou, remove da contagem total
                totalQuantity -= 1; // Reduz a quantidade total
                totalEarnings -= items.ships.find(i => i.name === purchasedItem.item)?.earnings || 0; // Ajusta o rendimento
                return false; // Remove o item
            }
        });
    }

    // Adiciona evento para fechar o pop-up
    document.getElementById('close-popup').onclick = () => {
        document.getElementById('item-popup').style.display = 'none';
    };

    // Fecha o pop-up se o usuário clicar fora do conteúdo
    window.onclick = function(event) {
        const popup = document.getElementById('item-popup');
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    };

    // Exibir naves por padrão
    displayItems('ships');

    // Adicionar eventos aos botões de categoria
    document.getElementById('show-ships').addEventListener('click', () => {
        displayItems('ships');
        updateActiveButton('show-ships');
    });

    document.getElementById('show-planets').addEventListener('click', () => {
        displayItems('planets');
        updateActiveButton('show-planets');
    });

    document.getElementById('show-miners').addEventListener('click', () => {
        displayItems('miners');
        updateActiveButton('show-miners');
    });

    // Atualiza o botão ativo
    function updateActiveButton(activeButtonId) {
        document.querySelectorAll('.category-btn').forEach(button => {
            button.classList.remove('active');
        });
        document.getElementById(activeButtonId).classList.add('active');
    }

    // Intervalo para verificar itens expirados a cada dia (ou qualquer intervalo desejado)
    setInterval(checkExpiredItems, 1000 * 60 * 60 * 24); // Verifica a cada 24 horas
});