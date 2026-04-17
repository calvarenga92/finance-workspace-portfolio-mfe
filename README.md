# Finance Workspace - Portfolio MFE

Esse projeto é um micro frontend responsável pela feature de carteira de investimentos dentro de uma aplicação maior baseada em Module Federation.

Aqui eu quis simular um cenário real onde uma parte da aplicação é construída e entregue de forma independente, mas ainda assim integrada a um container (shell).

---

## Sobre o projeto

Esse micro frontend representa uma tela de **visualização de ativos financeiros**, com informações como:
- Lista de ativos
- Alocação da carteira
- Performance (P&L)
- Filtros por nome e status

Apesar de ser um exemplo simples, a ideia foi estruturar como se fosse uma feature real isolada dentro de um ecossistema maior.

---

## Objetivo

Nesse projeto eu quis demonstrar:
- Como criar um micro frontend desacoplado
- Como expor um módulo usando Module Federation
- Como manter independência de build e execução
- Como integrar com um shell externo

---

## Arquitetura
Esse projeto faz parte de uma arquitetura dividida em:

- **Shell (container)**  
  Responsável pela aplicação principal e integração

- **Portfolio MFE (esse repositório)**  
  Responsável pela feature de carteira

O módulo exposto aqui é consumido dinamicamente pelo shell via `remoteEntry.js`.

---

## Tecnologias utilizadas

- React 18
- TypeScript
- Vite
- Module Federation (`@originjs/vite-plugin-federation`)
- CSS puro

---

## Exposição do módulo
- Nesse projeto eu exponho o componente principal: PortfolioApp

---

- Esse módulo é consumido pelo shell via: portfolio_mfe/PortfolioApp

---

## Como rodar o projeto
Rodar em modo produção (recomendado para integração com o shell)
- npm install
- npm run build
- npm run preview

A aplicação sobe em: http://localhost:4173

E o módulo remoto fica disponível em: http://localhost:4173/assets/remoteEntry.js

- npm run dev

---

## Observações importantes
 - O shell consome esse MFE via remoteEntry.js
 - O base do Vite precisa estar configurado corretamente para evitar problemas com assets (principalmente CSS)
 - O CSS é carregado dinamicamente pelo próprio remoteEntry
 - Esse projeto pode rodar completamente independente do shell

---

## O que eu quis mostrar com esse projeto 
 - Mais do que a tela em si, aqui o foco foi arquitetura e organização.
 
---

## Quis demonstrar:
 - Como isolar uma feature em um micro frontend
 - Como expor e consumir módulos dinamicamente
 - Como manter independência entre aplicações
 - Como lidar com carregamento de assets (CSS/JS) no contexto de MFEs

---

## É um exemplo simples, mas que representa bem um cenário real de micro frontends.

---

## Docker (opcional)
 - docker build -t portfolio-mfe .
 - docker run --rm -p 4173:4173 portfolio-mfe

--- 

## Desenvolvido por Claudio Alvarenga